
import * as React from "react"

// Define breakpoints for different device sizes
const BREAKPOINTS = {
  mobile: 768,  // Mobile phones (< 768px)
  tablet: 1024, // Tablets (768px - 1024px)
  desktop: 1280 // Desktop (> 1024px)
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | undefined;

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  orientation: 'portrait' | 'landscape' | undefined;
}

/**
 * Enhanced hook for responsive design that provides detailed device information
 * @returns DeviceInfo object with device type, size and orientation details
 */
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    deviceType: undefined,
    orientation: undefined
  });

  React.useEffect(() => {
    // Function to update device information based on screen size
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine device type based on width
      const isMobile = width < BREAKPOINTS.mobile;
      const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;
      const isDesktop = width >= BREAKPOINTS.desktop;
      
      // Determine device type
      let deviceType: DeviceType = undefined;
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';
      else if (isDesktop) deviceType = 'desktop';
      
      // Determine orientation
      const orientation = width > height ? 'landscape' : 'portrait';
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        orientation
      });
    };

    // Set initial value
    updateDeviceInfo();
    
    // Add event listeners for resize and orientation change
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

/**
 * Legacy hook for backward compatibility
 * @returns boolean indicating if device is mobile
 */
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceInfo();
  return isMobile;
}
