import { colors } from '@/src/constants/colors'
import { Text as NativeText, TextProps as NativeTextProps } from 'react-native'

type TextProps = {
  weight?: 'thin' | 'regular' | 'medium' | 'semiBold' | 'bold'
} & NativeTextProps

const weightMap = {
  thin: 'Inter-Thin',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
}

const Text = ({ weight = 'regular', style, children, ...props }: TextProps) => {
  return (
    <NativeText
      style={[
        {
          fontFamily: weightMap[weight],
          color: colors.black.default,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </NativeText>
  )
}

export default Text
