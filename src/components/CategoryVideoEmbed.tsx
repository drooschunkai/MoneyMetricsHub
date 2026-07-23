import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { CategoryVideo } from '../data/categoryVideos';

interface CategoryVideoEmbedProps {
  video: CategoryVideo;
  categoryName: string;
}

export default function CategoryVideoEmbed({ video, categoryName }: CategoryVideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`;
  const thumbnailUrl = thumbError
    ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  return (
    <div id={`category-video-${video.categoryId}`} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
            <Lucide.Video className="w-4 h-4 text-red-500" />
            {video.title}
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          Video Explainer
        </span>
      </div>

      {/* Video Container Aspect Ratio 16:9 */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-inner group">
        {!isPlaying ? (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${video.title} video summary for ${categoryName}`}
            className="w-full h-full relative cursor-pointer flex items-center justify-center text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl overflow-hidden"
          >
            {/* Lazy Thumbnail Image */}
            <img
              src={thumbnailUrl}
              alt={`${video.title} video thumbnail`}
              loading="lazy"
              onError={() => setThumbError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            {/* Play Button Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-110 group-active:scale-95 border-2 border-white/20">
                <Lucide.Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              </div>
            </div>

            {/* Bottom Overlay Label */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-medium truncate max-w-[80%]">
                {video.description}
              </span>
              <span className="bg-red-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                <Lucide.Play className="w-2.5 h-2.5 fill-current" />
                Play Video
              </span>
            </div>
          </button>
        ) : (
          <iframe
            src={embedUrl}
            title={`${video.title} - ${categoryName} Video Explainer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0 rounded-2xl"
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <p className="line-clamp-1">{video.description}</p>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2">
          youtube-nocookie.com mode
        </span>
      </div>
    </div>
  );
}
