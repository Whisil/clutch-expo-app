import { colors } from '@/src/constants/colors'
import { Text, TextProps } from 'react-native'

type HeadingProps = {
  weight?: 'regular' | 'medium' | 'bold' | 'extraBold' | 'black'
  size?: 'extraSmall' | 'small' | 'regular' | 'medium' | 'large' | 'extraLarge'
} & TextProps

const fontMap = {
  regular: 'MontserratAlt-Regular',
  medium: 'MontserratAlt-Medium',
  bold: 'MontserratAlt-Bold',
  extraBold: 'MontserratAlt-ExtraBold',
  black: 'MontserratAlt-Black',
}

const sizeMap = {
  extraSmall: 16,
  small: 18,
  regular: 24,
  medium: 28,
  large: 32,
  extraLarge: 38,
}

const Heading = ({
  weight = 'medium',
  size = 'regular',
  style,
  children,
  ...props
}: HeadingProps) => {
  return (
    <Text
      style={[
        {
          fontFamily: fontMap[weight],
          fontSize: sizeMap[size],
          lineHeight: sizeMap[size] + 2,
          color: colors.black.default,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  )
}

export default Heading
