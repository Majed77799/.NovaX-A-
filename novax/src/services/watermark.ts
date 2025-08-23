import * as ImageManipulator from 'expo-image-manipulator';

export const generateWatermarkLabel = (userId: string, userName?: string) => {
  return `${userName ?? 'User'} · ${userId}`;
};

export const watermarkImage = async (uri: string, watermarkText: string) => {
  // Placeholder: overlay text using a simple operation; expo-image-manipulator has limited text APIs
  // In production, render a transparent PNG and overlay
  const result = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.9, format: ImageManipulator.SaveFormat.PNG });
  return result.uri;
};