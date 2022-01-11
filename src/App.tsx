import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const App = () => {
  const [pos, setPos] = useState({
    x: 0,
    y: 0,
  });

  const { x, y } = pos;

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);

    const marker = new window.kakao.maps.Marker({
      position: map.getCenter(),
    });

    marker.setMap(map);
    marker.setDraggable(true);
    map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT);

    window.kakao.maps.event.addListener(
      map,
      "click",
      function (mouseEvent: any) {
        var latlng = mouseEvent.latLng;

        marker.setPosition(latlng);

        setPos({
          x: latlng.getLat(),
          y: latlng.getLng(),
        });
      }
    );
  }, []);

  // const handle = () => {
  //   setPos({
  //     x: x + 0.001,
  //     y: y + 0.001,
  //   });
  //   window.kakao.maps.load(() => {

  //   })
  // };

  return (
    <>
      <div className="App">
        <div id="map" style={{ width: "900px", height: "600px" }}></div>
      </div>
    </>
  );
};

export default App;
