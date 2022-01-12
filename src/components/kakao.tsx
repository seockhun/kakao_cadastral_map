import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Ab from "./assets/Ab.png";

declare global {
  interface Window {
    kakao: any;
  }
}

const Kakao = () => {
  // const [pos, setPos] = useState({
  //   x: 0,
  //   y: 0,
  // });

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(36.634249797, 127.129160067),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);

    var bounds = new window.kakao.maps.LatLngBounds(
      new window.kakao.maps.LatLng(36.634249797, 127.129160067),
      new window.kakao.maps.LatLng(36.734249797, 127.410516004)
    );

    // const marker = new window.kakao.maps.Marker({
    //   position: map.getCenter(),
    // });
    // marker.setMap(map);
    // marker.setDraggable(true);

    // window.kakao.maps.event.addListener(
    //   map,
    //   "click",
    //   function (mouseEvent: any) {
    //     var latlng = mouseEvent.latLng;

    //     marker.setPosition(latlng);

    //     setPos({
    //       x: latlng.getLat(),
    //       y: latlng.getLng(),
    //     });
    //   }
    // );
  }, []);

  // const handle = () => {
  //   setPos({
  //     x: x + 0.001,
  //     y: y + 0.001,
  //   });
  //   window.kakao.maps.load(() => {

  //   })
  // };

  return <div id="map" style={{ width: "1200px", height: "900px" }}></div>;
};

export default Kakao;
