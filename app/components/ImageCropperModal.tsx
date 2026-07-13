"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/app/lib/cropImage";

interface ImageCropperModalProps {
  imageSrc: string;
  aspectRatio: number;
  onCropComplete: (croppedImageFile: File) => void;
  onCancel: () => void;
  isCircular?: boolean;
}

export default function ImageCropperModal({
  imageSrc,
  aspectRatio,
  onCropComplete,
  onCancel,
  isCircular = false,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, "cropped.jpg");
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ position: 'relative', width: '90vw', height: '60vh', maxWidth: 800, background: '#111', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          cropShape={isCircular ? "round" : "rect"}
          showGrid={!isCircular}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>
      
      <div style={{ marginTop: 24, width: '90vw', maxWidth: 800, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: '#fff', fontSize: 14 }}>Zoom</span>
        <input 
          type="range" 
          value={zoom} 
          min={1} 
          max={3} 
          step={0.1} 
          aria-labelledby="Zoom" 
          onChange={(e) => setZoom(Number(e.target.value))} 
          style={{ flex: 1 }}
        />
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
        <button 
          onClick={onCancel} 
          disabled={isProcessing}
          style={{ padding: '12px 32px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.2)', color: '#fff', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 16, fontWeight: 600, transition: '0.2s' }}>
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          disabled={isProcessing} 
          style={{ padding: '12px 32px', borderRadius: 99, border: 'none', background: '#ff4500', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 16, boxShadow: '0 8px 24px rgba(255,69,0,0.3)', transition: '0.2s' }}>
          {isProcessing ? 'Processing...' : 'Apply & Save'}
        </button>
      </div>
    </div>
  );
}
