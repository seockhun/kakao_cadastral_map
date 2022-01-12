import React, { useEffect } from "react";
import $ from "jquery";
declare global {
  interface Window {
    naver: any;
  }
}

const Naver = () => {
  useEffect(() => {
    const map = new window.naver.maps.Map("map", {
      zoom: 16,
      center: new window.naver.maps.LatLng(37.3595316, 127.1052133),
      mapTypeControl: true,
    });

    const infoWindow = new naver.maps.InfoWindow({
      anchorSkew: true,
      content: "",
    });

    map.setCursor("pointer");

    function searchCoordinateToAdress(latlng: any) {
      infoWindow.close();

      window.naver.maps.Service.reverseGeocode(
        {
          coords: latlng,
          orders: [
            window.naver.maps.Service.OrderType.ADDR,
            window.naver.maps.Service.OrderType.ROAD_ADDR,
          ].join(","),
        },
        function (status: any, response: { v2: { results: any } }) {
          if (status === window.naver.maps.Service.Status.ERROR) {
            return alert("Something Wrong");
          }

          const items = response.v2.results;
          let address = "";
          const htmlAddresses: any[] = [];

          for (let i = 0, ii = items.length, item, addrType; i < ii; i++) {
            item = items[i];
            address = makeAddress(item) || "";
            addrType =
              item.name === "roadaddr" ? "[도로명 주소]" : "[지번 주소]";
          }

          infoWindow.setContent(
            [
              '<div style={{padding: "10px", minWidth: "200px", lineHeight: "150%"}}>',
              '<h4 style={{ marginTop: "5px" }}>검색 좌표</h4> br />',
              htmlAddresses.join("<br />"),
              "</div>",
            ].join("\n")
          );
          infoWindow.open(map, latlng);
        }
      );
    }

    function searchAddressToCoordinate(address: any) {
      window.naver.maps.Service.geogode(
        {
          query: address,
        },
        function (
          status: any,
          response: {
            v2: { meta: { totalCount: string | number }; addresses: any[] };
          }
        ) {
          if (status === window.naver.maps.Service.Status.ERROR) {
            return alert("something Wrong!");
          }

          if (response.v2.meta.totalCount === 0) {
            return alert("totlaCount" + response.v2.meta.totalCount);
          }

          const htmlAddresses = [];
          const item = response.v2.addresses[0];
          const point = new window.naver.maps.Point(item.x, item.y);

          if (item.roadAddress) {
            htmlAddresses.push("[도로명 주소]" + item.roadAddress);
          }

          if (item.jibunAddress) {
            htmlAddresses.push("[지번 주소]" + item.jibunAddress);
          }

          if (item.englishAddress) {
            htmlAddresses.push("[영문명 주소]" + item.englishAddress);
          }

          infoWindow.setContent(
            [
              '<div style={{padding: "10px", minWidth: "200px", lineHeight: "150%"}}>',
              '<h4 style={{ marginTop: "5px" }}>검색주소 : ' +
                address +
                "</h4> br />",
              htmlAddresses.join("<br />"),
              "</div>",
            ].join("\n")
          );
          map.setCenter(point);
          infoWindow.open(map, point);
        }
      );
    }

    function initGeocoder() {
      if (!map.isStyleMapReady) {
        return;
      }

      map.addListener("click", function (e: any) {
        searchCoordinateToAdress(e.coord);
      });

      $("#address").on("keydown", function (e: any) {
        const keyCode = e.which;

        if (keyCode === 13) {
          searchAddressToCoordinate($("#address").val());
        }
      });

      $("#submit").on("click", function (e: any) {
        e.preventDefault();
        searchAddressToCoordinate($("#address").val());
      });

      searchAddressToCoordinate("정자동 178-1");
    }

    function makeAddress(item: { name: any; region: any; land: any }) {
      if (!item) {
        return;
      }
      const name = item.name;
      const region = item.region;
      const land = item.land;
      const isRoadAddress = name === "roadaddr";
      let sido = "",
        sigugun = "",
        dongmyun = "",
        ri = "",
        rest = "";

      if (hasArea(region.area1)) {
        sido = region.area1.name;
      }

      if (hasArea(region.area2)) {
        sigugun = region.area2.name;
      }

      if (hasArea(region.area3)) {
        dongmyun = region.area3.name;
      }
      if (hasArea(region.area4)) {
        ri = region.area4.name;
      }

      if (land) {
        if (hasData(land.number1)) {
          if (hasData(land.type) && land.type === "2") {
            rest += "산";
          }

          rest += land.number1;

          if (hasData(land.number2)) {
            rest += "-" + land.number2;
          }
        }
        if (isRoadAddress === true) {
          if (checkLastString(dongmyun, "면")) {
            ri = land.name;
          } else {
            dongmyun = land.name;
            ri = "";
          }

          if (hasAddition(land.addition0)) {
            rest += " " + land.addition0.value;
          }
        }
      }

      return [sido, sigugun, dongmyun, ri, rest].join(" ");
    }

    function hasArea(area: { name: string }) {
      return !!(area && area.name && area.name !== "");
    }

    function hasData(data: string) {
      return !!(data && data !== "");
    }

    function checkLastString(word: string, lastString: string) {
      return new RegExp(lastString + "$").test(word);
    }

    function hasAddition(addition: { value: any }) {
      return !!(addition && addition.value);
    }

    window.naver.maps.onJSContentLoaded = initGeocoder;
    window.naver.maps.Event.once(map, "init_stylemap", initGeocoder);
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "100vw", height: "100vh" }}></div>
      <div
        className="search"
        style={{ position: "absolute", zIndex: 10, top: 50 }}
      >
        <input
          style={{ width: "300px", height: "30px" }}
          id="address"
          type="text"
        />
        <input type="button" name="" id="submit" value="주소검색" />
      </div>
    </div>
  );
};

export default Naver;
