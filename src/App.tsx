import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
// import { useScreenshot, createFileName } from 'use-react-screenshot'
import domtoimage from "dom-to-image-more";
import { Button, Input, Switch, Slider } from "@mui/material"

import { toBase64, ImageDataResolve } from './utils'
import pct from '../src/assets/pct.png'
import layer3 from "../src/assets/Layer_3.png"


const download = (image : string, { name = "img", extension = "jpg" } = {}) => {
  const a = document.createElement("a");
  a.style.display = 'none'
  a.href = image;
  a.download = `${name}.${extension}`
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleChangeImage = (
  set: React.Dispatch<React.SetStateAction<string | null>>,
  e: ChangeEvent<HTMLInputElement>,
  imgRef: React.MutableRefObject<HTMLImageElement | null>
) => {
  if (e.target.files && e.target.files[0]) {
    toBase64(e.target.files[0])
      .then((data: ImageDataResolve) => {
        imgRef.current = data.image;
        set(data.base64 as string)
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
    e.target.value = "";
  }
};


function App() {
  const [image, setImage] = useState<null | string>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [shouldShowBG, setShowBG] = useState(false);
  // const [bgImage, setBgImage] = useState<null | InstanceType<typeof Image>>(null)

  const screenShotRef = useRef<HTMLDivElement | null>(null);
  // const [screenShot, takeScreenshot] = useScreenshot();
  // const getImage = () => takeScreenshot(screenShotRef.current);
  const [screenShot, takeScreenshot] = useState<null | string>(null);
  const getImage = () => {
    domtoimage.toPng(screenShotRef.current)
    .then((dataUrl : string) => takeScreenshot(dataUrl))
  }

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  // 
  const bgRef = useRef<null | HTMLCanvasElement>(null);
  const bgDataRef = useRef<null | HTMLCanvasElement>(null);
  const bgImgRef = useRef<null | HTMLImageElement>(null);
  

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      if (canvasRef && canvasRef.current && image && imgRef.current) {
        const ctx = canvasRef.current.getContext("2d");

        canvasRef.current.width = imgRef.current.width;
        canvasRef.current.height = imgRef.current.height;
        
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        if (ctx && w && h) {
          ctx?.clearRect(0, 0, w, h);
          
          ctx?.drawImage(
            imgRef.current,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            w,
            h
          )
        }
      }
    },
    [image]
  );

  const handleShowBG = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowBG(event.target.checked);
  };

  const storeImageBG = (file: File) => {
    if(bgDataRef && bgDataRef.current){
      toBase64(file)
      .then(res => {
        const { image } = res
        if(bgDataRef && bgDataRef.current){
          const ctx = bgDataRef.current.getContext("2d");
          const w = bgDataRef.current.width;
          const h = bgDataRef.current.height;

          if (ctx && w && h) {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, w, h)
            merge2Canvas()
          }
        }
      })
    }
  }

  const merge2Canvas = () => {
    if(bgRef.current && bgDataRef.current){
      const targetCtx = bgRef.current.getContext('2d');
      const resourceCtx = bgDataRef.current.getContext('2d');

      const w = bgRef.current.width;
      const h = bgRef.current.height;

      const targetData = targetCtx?.getImageData(0, 0, w, h);
      const resourceData = resourceCtx?.getImageData(0, 0, w, h);

      if(targetData && resourceData) {
        const size = targetData.height * targetData.width * 4
        for(let i = 3; i < size-3; i += 4){
          const alpha = targetData.data[i]
          if(alpha === 0) {
            resourceData.data[i] = 0
          } else {
            resourceData.data[i] = 155
          }
        }
        targetCtx?.putImageData(resourceData, 0, 0);
      }

    }
  }

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.height = 360;
      canvasRef.current.width = 185;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "lightgray";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);


  useEffect(() => {
    if(bgRef.current && bgImgRef.current && bgDataRef.current){

      bgRef.current.width = bgImgRef.current.width;
      bgRef.current.height = bgImgRef.current.height;

      bgDataRef.current.width = bgImgRef.current.width;
      bgDataRef.current.height = bgImgRef.current.height;
      const ctx = bgRef.current.getContext('2d');
      if(ctx){
        ctx?.drawImage(bgImgRef.current, 0, 0);  
      }

    }
  }, [shouldShowBG])

  return (
    <div className="App">
      <Input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChangeImage(setImage, e, imgRef)
        }
      />
      <div className="crop-section">
        {image && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            maxZoom={5}
            cropShape="rect"
            objectFit="contain"
            cropSize={{
              width: 223,
              height: 390
            }}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        )}
      </div>
      <div style={{ width: 300 }}>
        {
          image && 
          <Slider 
            defaultValue={100}
            min={100}
            max={500}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={(event: Event, value: number | number[], activeThumb: number) => {
              setZoom(prev => Number(value)/100)
            }}
            value={zoom * 100 }
          />
        }  
        <Button 
          variant="contained" 
          color="success"
          onClick={getImage}
        >
          generate combined image
        </Button>

        <Switch color="warning" onChange={handleShowBG} checked={shouldShowBG} />
        { 
          shouldShowBG && <Input 
            type="file"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              e.target.files && storeImageBG(e.target.files[0])
            }
          />
        }
        
        
        { 
          screenShot && 
          <Button 
            variant="contained" 
            color="success"
            onClick={
              () => {
                download(
                  screenShot, 
                  { name: 'sample-case', extension: 'png' }
                )
                takeScreenshot(prev => null)
              }
            }
          >
            download sample image
          </Button> 
        }
      </div>
      <div className="template" ref={screenShotRef}>
        <div className="container">
          <img src={pct} />
          {/* <img src={layerShadow} /> */}
          <canvas ref={canvasRef} className="case-target" />
          <div className="over-layer">
            <div className="light1"></div>
            <div className="dark1"></div>
            <div className="dark2"></div>
            <div className="light2"></div>
          </div>
        </div>
        <div className="bg-container" >
          <div className="bg-wrapper">
            {
              shouldShowBG &&
              <>
                <canvas className="bg" ref={bgRef} />
                <canvas className="image-data" ref={bgDataRef}/>
              </> 
              }
          </div>
        </div>

      </div>
      <img src={layer3} ref={bgImgRef} style={{ display: 'none', width: '100%', objectFit: 'scale-down' }} />
    </div>
  );
}

export default App;
