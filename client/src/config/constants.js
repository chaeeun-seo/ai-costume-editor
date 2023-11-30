import { swatch, fileIcon, ai, openai, logoShirt, stylishShirt, stableDiffusion, stabilityAI, novita, sda } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
  },
  {
    name: "aipicker",
    icon: ai,
  },
  {
    name: "dallepicker",
    icon: openai,
  },
  {
    name: "sdpicker",
    icon: stableDiffusion,
  },
  {
    name: "sapicker",
    icon: stabilityAI,
  },
  {
    name: "novitapicker",
    icon: novita,
  },
  {
    name: "sdapicker",
    icon: sda,
  },
];

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
  },
  {
    name: "stylishShirt",
    icon: stylishShirt,
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
};
