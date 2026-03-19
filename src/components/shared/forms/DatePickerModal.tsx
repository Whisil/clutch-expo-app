import Text from '@/src/components/shared/typography/Text'
import { colors } from '@/src/constants/colors'
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'

const DatePickerModal = ({
  visible,
  value,
  maximumDate,
  onConfirm,
  onClose,
  onClear,
}: {
  visible: boolean
  value: Date
  maximumDate?: Date
  onConfirm: (date: Date) => void
  onClose: () => void
  onClear?: () => void
}) => {
  if (!visible) return null

  const [pendingDate, setPendingDate] = useState<Date>(value)

  useEffect(() => {
    if (visible) setPendingDate(value)
  }, [visible, value])

  const handleValueChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    setPendingDate(date)
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
              onPress={() => {
                onConfirm(pendingDate)
                onClose()
              }}
              style={styles.actionBtn}
            >
              <Text weight="semiBold" style={styles.actionText}>
                Done
              </Text>
            </Pressable>
          </View>

          <DateTimePicker
            value={pendingDate}
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

export default DatePickerModal
