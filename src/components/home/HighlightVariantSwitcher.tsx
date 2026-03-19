import Text from '@/src/components/shared/typography/Text'
import { Pressable, StyleSheet, View } from 'react-native'

export type HighlightVariant =
  | 'clutchAutopan'
  | 'matchWithoutBreaks'
  | 'clutchLandscape'

type HighlightVariantSwitcherProps = {
  selectedVariant: HighlightVariant
  onSelect: (variant: HighlightVariant) => void
}

const variants: { id: HighlightVariant; label: string }[] = [
  { id: 'clutchAutopan', label: 'Autopan' },
  { id: 'matchWithoutBreaks', label: 'Match' },
  { id: 'clutchLandscape', label: 'Landscape' },
]

const HighlightVariantSwitcher = ({
  selectedVariant,
  onSelect,
}: HighlightVariantSwitcherProps) => {
  return (
    <View style={styles.container}>
      {variants.map((variant) => {
        const isActive = selectedVariant === variant.id
        return (
          <Pressable
            accessibilityRole="button"
            key={variant.id}
            onPress={() => onSelect(variant.id)}
            style={[styles.button, isActive && styles.activeButton]}
          >
            <Text
              weight="semiBold"
              style={[styles.label, isActive && styles.activeLabel]}
            >
              {variant.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    left: 12,
    position: 'absolute',
    top: 12,
    zIndex: 2,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  activeLabel: {
    color: '#000000',
  },
})

export default HighlightVariantSwitcher
