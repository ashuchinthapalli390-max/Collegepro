import React from 'react';
import MediaCardShell from './MediaCardShell.jsx';
import NECVideo from './NECVideo.jsx';

/**
 * Domain-specific Campus Video Card
 */
export default function MediaVideoCard({
  item,
  aspectRatio = '16/9',
  style = {}
}) {
  if (!item) return null;

  return (
    <MediaCardShell
      title={item.title}
      category={item.category}
      description={item.description}
      style={style}
    >
      <NECVideo
        id={item.id}
        src={item.publicUrl || item.storagePath || item.file}
        poster={item.posterUrl || item.poster}
        title={item.title}
        category={item.category}
        duration={item.durationFormatted || item.duration || '--:--'}
        aspectRatio={aspectRatio}
      />
    </MediaCardShell>
  );
}
