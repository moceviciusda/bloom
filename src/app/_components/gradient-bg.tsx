'use client';

import { Box, keyframes, type BoxProps } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import useMousePosition from '../hooks/useMousePosition';

const moveInCircle = keyframes`
    0% {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(180deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const moveVertical = keyframes`
    0% {
        transform: translateY(-50%);
    }
    50% {
        transform: translateY(50%);
    }
    100% {
        transform: translateY(-50%);
    }
`;

const moveHorizontal = keyframes`
    0% {
        transform: translateX(-50%) translateY(-10%);
    }
    50% {
        transform: translateX(50%) translateY(10%);
    }
    100% {
        transform: translateX(-50%) translateY(-10%);
    }
`;

const GradientBg: React.FC<
  BoxProps & {
    animationProps?: {
      circleSize?: string;
      bgColor?: BoxProps['bg'];
      color1?: BoxProps['bg'];
      color2?: BoxProps['bg'];
      color3?: BoxProps['bg'];
      color4?: BoxProps['bg'];
      color5?: BoxProps['bg'];
      colorInterractive?: BoxProps['bg'];
      mixBlendMode?: BoxProps['mixBlendMode'];
    };
  }
> = ({ animationProps, ...boxProps }) => {
  const interactiveBubbleRef = useRef<HTMLDivElement>(null);

  const { x, y } = useMousePosition();

  useEffect(() => {
    if (interactiveBubbleRef.current) {
      interactiveBubbleRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, [x, y]);

  return (
    <Box
      position='relative'
      bg={
        animationProps?.bgColor ??
        'linear-gradient(40deg, rgb(108, 0, 162), rgb(0, 17, 82))'
      }
      {...boxProps}
      sx={{ ...boxProps.sx }}
    >
      <svg xmlns='http://www.w3.org/2000/svg' style={{ display: 'none' }}>
        <defs>
          <filter id='goo'>
            <feGaussianBlur
              in='SourceGraphic'
              stdDeviation='10'
              result='blur'
            />
            <feColorMatrix
              in='blur'
              mode='matrix'
              values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8'
              result='goo'
            />
            <feBlend in='SourceGraphic' in2='goo' />
          </filter>
        </defs>
      </svg>

      <Box
        filter='url(#goo) blur(40px)'
        width='100%'
        height='100%'
        position='absolute'
        overflow='hidden'
      >
        <Box
          position='absolute'
          bg={
            animationProps?.color1 ??
            'radial-gradient(circle at center, rgba(18, 113, 255, .8) 0, rgba(18, 113, 255, 0) 50%) no-repeat'
          }
          mixBlendMode='hard-light'
          width={animationProps?.circleSize ?? '80%'}
          height={animationProps?.circleSize ?? '80%'}
          top={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          left={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          transformOrigin='calc(50% - 400px)'
          animation={`${moveVertical} 30s ease infinite`}
          opacity={1}
        />
        <Box
          position='absolute'
          bg={
            animationProps?.color2 ??
            'radial-gradient(circle at center, rgba(221, 74, 255, .8) 0, rgba(221, 74, 255, 0) 50%) no-repeat'
          }
          mixBlendMode='hard-light'
          width={animationProps?.circleSize ?? '80%'}
          height={animationProps?.circleSize ?? '80%'}
          top={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          left={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          transformOrigin='calc(50% - 400px)'
          animation={`${moveInCircle} 20s reverse infinite`}
          opacity={1}
        />
        <Box
          position='absolute'
          bg={
            animationProps?.color3 ??
            'radial-gradient(circle at center, rgba(100, 220, 255, .8) 0, rgba(100, 220, 255, 0) 50%) no-repeat'
          }
          mixBlendMode='hard-light'
          width={animationProps?.circleSize ?? '80%'}
          height={animationProps?.circleSize ?? '80%'}
          top={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          left={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          transformOrigin='calc(50% - 400px)'
          animation={`${moveInCircle} 40s linear infinite`}
          opacity={1}
        />
        <Box
          position='absolute'
          bg={
            animationProps?.color4 ??
            'radial-gradient(circle at center, rgba(200, 50, 50, .8) 0, rgba(200, 50, 50, 0) 50%) no-repeat'
          }
          mixBlendMode='hard-light'
          width={animationProps?.circleSize ?? '80%'}
          height={animationProps?.circleSize ?? '80%'}
          top={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          left={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          transformOrigin='calc(50% - 400px)'
          animation={`${moveHorizontal} 40s ease infinite`}
          opacity={0.7}
        />
        <Box
          position='absolute'
          bg={
            animationProps?.color5 ??
            'radial-gradient(circle at center, rgba(180, 180, 50, .8) 0, rgba(180, 180, 50, 0) 50%) no-repeat'
          }
          mixBlendMode='hard-light'
          width={animationProps?.circleSize ?? '80%'}
          height={animationProps?.circleSize ?? '80%'}
          top={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          left={`calc(50% - ${animationProps?.circleSize ?? '80%'} / 2)`}
          transformOrigin='calc(50% - 400px)'
          animation={`${moveInCircle} 20s ease infinite`}
          opacity={1}
        />

        {/* interractive bubble that follows cursor */}
        <Box
          ref={interactiveBubbleRef}
          position='absolute'
          bg={
            animationProps?.colorInterractive ??
            'radial-gradient(circle at center, rgba(140, 100, 255, .8) 0, rgba(140, 100, 255, 0) 50%) no-repeat'
          }
          mixBlendMode={animationProps?.mixBlendMode ?? 'hard-light'}
          width='100%'
          height='100%'
          top='-50%'
          left='-50%'
          opacity={0.7}
        />
      </Box>
      {boxProps.children}
    </Box>
  );
};

export default GradientBg;
