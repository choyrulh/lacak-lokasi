function Iframe() {
  return (
    <div
      className="sketchfab-embed-wrapper"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <iframe
        title="DJI Mavic 3"
        frameBorder="0"
        allowFullScreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking="false"
        execution-while-out-of-viewport="true"
        execution-while-not-rendered="true"
        web-share="true"
        style={{ width: "100%", height: "400px" }}
        src="https://sketchfab.com/models/c5a5abae1dea468ab73b1bdc7d616fa6/embed?autostart=1"
      ></iframe>
      <p
        style={{
          fontSize: "13px",
          fontWeight: "normal",
          margin: "5px",
          color: "#4A4A4A",
        }}
      >
        <a
          href="https://sketchfab.com/3d-models/dji-mavic-3-c5a5abae1dea468ab73b1bdc7d616fa6?utm_medium=embed&utm_campaign=share-popup&utm_content=c5a5abae1dea468ab73b1bdc7d616fa6"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          DJI Mavic 3
        </a>{" "}
        by{" "}
        <a
          href="https://sketchfab.com/llirikslon?utm_medium=embed&utm_campaign=share-popup&utm_content=c5a5abae1dea468ab73b1bdc7d616fa6"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          llirikslon
        </a>{" "}
        on{" "}
        <a
          href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=c5a5abae1dea468ab73b1bdc7d616fa6"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          Sketchfab
        </a>
      </p>
    </div>
  );
}

export default Iframe;
