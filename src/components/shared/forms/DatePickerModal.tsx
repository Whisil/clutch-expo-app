import Text from '@/src/components/shared/typography/Text'
import { colors } from '@/src/constants/colors'
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker'
import { Modal, Pressable, StyleSheet, View } from 'react-native'

export default function DatePickerModal({
  visible,
  value,
  maximumDate,
  onChange,
  onClose,
  onClear,
}: {
  visible: boolean
  value: Date
  maximumDate?: Date
  onChange: (date: Date) => void
  onClose: () => void
  onClear?: () => void
}) {
  if (!visible) return null

  const handleValueChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    onChange(date)
  }

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                onClear?.()
                onClose()
              }}
              style={styles.actionBtn}
              disabled={!onClear}
            >
              <Text
                weight="semiBold"
                style={[styles.actionText, !onClear && styles.actionDisabled]}
              >
                Clear
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={styles.actionBtn}
            >
              <Text weight="semiBold" style={styles.actionText}>
                Done
              </Text>
            </Pressable>
          </View>

          <DateTimePicker
            value={value}
            mode="date"
            display="spinner"
            onValueChange={handleValueChange}
            onDismiss={onClose}
            style={styles.datePicker}
            maximumDate={maximumDate}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    backgroundColor: colors.white.default,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  topBar: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white.mellow,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 14,
  },
  actionDisabled: {
    opacity: 0.35,
  },
  datePicker: { marginHorizontal: 'auto' },
})
