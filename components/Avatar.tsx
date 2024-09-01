import Image from "next/image";
import React from "react";
import { createAvatar } from "@dicebear/core";
import { rings } from "@dicebear/collection";

// add ? after classname cause it's an optional variable
function Avatar({ seed, className }: { seed: string; className?: string }) {
  // Generate an avatar
  // seed is value that will genreate a new obj everytime
  const avatar = createAvatar(rings, {
    seed,
    // ... other options
  });

  const svg = avatar.toString();

  // have to convert it to a data url, this is what an img is in code
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64"
  )}`;

  return <Image 
    src={dataUrl}
    alt="User Avatar"
    width={100}
    height={100}
    className={className}
  />;
}

export default Avatar;
