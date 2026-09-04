"use client";

import React from "react";

interface OnlineStatusBadgeProps {
  isOnline?: boolean;
  lastSeen?: string;
  lastSeenDisplay?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export default function OnlineStatusBadge({
  isOnline = false,
  lastSeen,
  lastSeenDisplay,
  showText = true,
  size = "md",
  className = "",
  style = {},
}: OnlineStatusBadgeProps) {
  const dotSize = size === "sm" ? 8 : size === "lg" ? 12 : 10;
  const fontSize = size === "sm" ? 11 : size === "lg" ? 14 : 12;

  const text = isOnline
    ? "Online"
    : lastSeenDisplay || (lastSeen ? "Offline" : "Offline");

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: showText ? (size === "sm" ? "2px 6px" : "3px 8px") : "0",
        borderRadius: 9999,
        background: showText
          ? isOnline
            ? "rgba(34, 197, 94, 0.12)"
            : "rgba(100, 116, 139, 0.12)"
          : "transparent",
        color: isOnline ? "#15803d" : "#64748b",
        fontWeight: 600,
        fontSize: fontSize,
        lineHeight: 1,
        ...style,
      }}
      title={isOnline ? "Online now" : text}
    >
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          width: dotSize,
          height: dotSize,
        }}
      >
        {isOnline && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              opacity: 0.75,
              animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
        )}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: isOnline ? "#22c55e" : "#94a3b8",
            border: "1.5px solid #ffffff",
          }}
        />
      </span>
      {showText && <span>{text}</span>}
    </span>
  );
}
