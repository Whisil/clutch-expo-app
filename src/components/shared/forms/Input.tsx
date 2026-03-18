import { colors } from '@/src/constants/colors'
import { ReactNode, useRef, useState } from 'react'
import {
  Platform,
  Pressable,
  StyleProp,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native'
import Text from '../typography/Text'

export type InputProps = {
  value: string
  onChange: (text: string) => void
  placeholder: string
  leftDecorator?: ReactNode
  type?: 'text' | 'password'
  style?: StyleProp<ViewStyle>
} & Omit<TextInputProps, 'onChange'>

const Input = ({
  value,
  onChange,
  placeholder,
  leftDecorator,
  type = 'text',
  style,
  ...props
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const inputRef = useRef<TextInput>(null)

  return (
    <Pressable
      style={[
        {
          backgroundColor: colors.white.default,
          borderRadius: 8,
          borderWidth: 1,
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
        },
        style,
      ]}
      onPress={() => {
        inputRef.current?.focus()
      }}
    >
      {leftDecorator}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        style={[
          {
            flex: 1,
            height: Platform.OS === 'android' ? '100%' : 'auto',
            lineHeight: 16,
            textAlignVertical: Platform.OS === 'android' ? 'top' : undefined,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        secureTextEntry={type === 'password' && !isPasswordVisible}
        {...props}
      />
      {type === 'password' && (
        <Pressable
          style={{ justifyContent: 'center' }}
          onPress={() => setIsPasswordVisible((prev) => !prev)}
        >
          <Text
            style={{
              color: colors.black.default,
              opacity: 0.5,
              lineHeight: 12,
              fontSize: 12,
              fontFamily: 'MontserratAlt-Black',
            }}
          >
            {isPasswordVisible ? 'Hide' : 'Show'}
          </Text>
        </Pressable>
      )}
    </Pressable>
  )
}

export default Input
