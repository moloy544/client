import VidStackPlayer from '@/components/HlsPlayer';
import ReactDOMServer from 'react-dom/server';

const ServerVidStackPlayer = ({ title, source, userIp }) => {

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VidStack Player</title>
      <link rel="stylesheet" href="https://cdn.vidstack.io/player/v0.8.33/styles.css">
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          background-color: black;
        }
        #player-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div id="player-container">
        ${ReactDOMServer.renderToString(
          <VidStackPlayer title={title} source={source} visibility={true} userIp={userIp} />
        )}
      </div>
      <script src="https://cdn.vidstack.io/player/v0.8.33/vidstack.min.js"></script>
    </body>
    </html>
  `;
};

export default ServerVidStackPlayer;
