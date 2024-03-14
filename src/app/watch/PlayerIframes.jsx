function VideoPlayerIframe({src, visibility}) {
    console.log(visibility)
  return (
    <iframe
          className={`fixed top-0 left-0 w-full h-full border-none z-[600]${visibility ? 'block': 'block'}`}
          src={src}
          allowFullScreen="allowfullscreen" />
  )
}

function TrailerPlayerIframe({src, visibility}) {
    console.log(visibility)
    return (
        <iframe
        className={`absolute top-0 left-0 w-full h-80 md:h-full rounded-md border-none z-[100] ${visibility ? 'block': 'block'}`}
        src={src} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

    )
  }

export {VideoPlayerIframe, TrailerPlayerIframe}
