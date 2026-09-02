import React from 'react';
import {
  Headphones,
  Watch,
  Camera,
  Footprints,
  Volume2,
  Briefcase,
  Music,
  Gamepad2,
  Laptop,
  Shirt,
  Smartphone,
  ShoppingBag,
  Armchair,
  Package
} from 'lucide-react';

interface ProductIconProps {
  name: string;
  className?: string;
}

export const ProductIcon: React.FC<ProductIconProps> = ({ name, className = 'w-8 h-8' }) => {
  switch (name.toLowerCase()) {
    case 'headphones':
      return <Headphones className={className} />;
    case 'watch':
      return <Watch className={className} />;
    case 'camera':
      return <Camera className={className} />;
    case 'footprints':
      return <Footprints className={className} />;
    case 'speaker':
    case 'volume2':
      return <Volume2 className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'music':
      return <Music className={className} />;
    case 'gamepad2':
      return <Gamepad2 className={className} />;
    case 'laptop':
      return <Laptop className={className} />;
    case 'shirt':
      return <Shirt className={className} />;
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'shoppingbag':
      return <ShoppingBag className={className} />;
    case 'armchair':
      return <Armchair className={className} />;
    default:
      return <Package className={className} />;
  }
};
