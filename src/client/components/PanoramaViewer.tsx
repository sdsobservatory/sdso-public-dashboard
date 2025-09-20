import { useRef, useEffect, useState, useCallback } from "hono/jsx";
import {
  Viewer,
  type ViewerConfig,
  type PanoData,
  EquirectangularAdapter,
  type PanoDataProvider,
} from "@photo-sphere-viewer/core";

import "@photo-sphere-viewer/core/index.css";

const panoDataProvider: PanoDataProvider = (image: HTMLImageElement, _xmpData?: PanoData) => {
  const panoData: PanoData = {
    fullWidth: image.width,
    fullHeight: image.height,
    croppedX: 0,
    croppedY: 0,
    croppedWidth: image.width,
    croppedHeight: image.height / 2,
    isEquirectangular: true,
  };
  return panoData;
};

function useDomElement(): [HTMLDivElement | undefined, (r: HTMLDivElement) => void] {
  const [element, setElement] = useState<HTMLDivElement>();
  const ref = useCallback(
    (r: HTMLDivElement) => {
      if (r && r !== element) {
        setElement(r);
      }
    },
    [element],
  );
  return [element, ref];
}

export interface PanoramaViewerProps {
  url: string;
}

export const PanoramaViewer = (props: PanoramaViewerProps) => {
  const [viewerElement, setRef] = useDomElement();
  const viewerRef = useRef<Viewer | null>(null);

  const setPanorama = () => {
    if (viewerRef.current) {
      // timestamp for cache busting
      const url = `${props.url}?time=${Date.now()}`;
      viewerRef.current.setPanorama(url, { showLoader: false });
    }
  };

  useEffect(() => {
    if (viewerElement && !viewerRef.current) {
      const config: ViewerConfig = {
        container: viewerElement,
        panorama: props.url,
        panoData: panoDataProvider,
        adapter: EquirectangularAdapter,
        defaultZoomLvl: 0,
        defaultPitch: Math.SQRT1_2,
      };

      const oneMinute = 60000;
      const interval = setInterval(setPanorama, oneMinute);

      const v = new Viewer(config);
      viewerRef.current = v;

      return () => {
        if (viewerRef.current) {
          viewerRef.current.destroy();
        }
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [viewerElement]);

  return (
    <div class="col-12">
      <div class="card border shadow rounded-2 overflow-hidden mt-4">
        <div class="card-header text-center fw-bold">Panorama</div>
        <div class="card-img">
          <div ref={setRef} id="pano-viewer" style="aspect-ratio: 3/2;" />
        </div>
      </div>
    </div>
  );
};
