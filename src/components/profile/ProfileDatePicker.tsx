import DatePickerModal from '@/src/components/shared/forms/DatePickerModal'
import Text from '@/src/components/shared/typography/Text'
import { colors } from '@/src/constants/colors'
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Platform, Pressable, StyleSheet } from 'react-native'

type ProfileDatePickerProps = {
  value: string
  onChange: (iso: string) => void
  disabled?: boolean
}

function formatIsoDateForDisplay(iso?: string) {
  if (!iso?.trim()) return ''
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return ''
  return iso
}

export default function ProfileDatePicker({
  value,
  onChange,
  disabled,
}: ProfileDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const displayed = formatIsoDateForDisplay(value)
  const selectedDate =
    displayed && /^\d{4}-\d{2}-\d{2}$/.test(displayed)
      ? new Date(`${displayed}T00:00:00Z`)
      : new Date('2000-01-01T00:00:00Z')

  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={[styles.dateButton, disabled && styles.dateButtonDisabled]}
      >
        <Text
          style={[styles.dateButtonText, !displayed && styles.datePlaceholder]}
        >
          {displayed || 'Select date'}
        </Text>
      </Pressable>

      {isOpen ? (
        Platform.OS === 'ios' ? (
          <DatePickerModal
            visible
            value={selectedDate}
            maximumDate={new Date()}
            onConfirm={(d) => onChange(d.toISOString().slice(0, 10))}
            onClear={() => onChange('')}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onValueChange={(_event: DateTimePickerChangeEvent, date: Date) => {
              setIsOpen(false)
              onChange(date.toISOString().slice(0, 10))
            }}
            onDismiss={() => setIsOpen(false)}
            maximumDate={new Date()}
          />
        )
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: colors.white.default,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateButtonDisabled: {
    opacity: 0.6,
  },
  dateButtonText: {
    fontSize: 14,
  },
  datePlaceholder: {
    opacity: 0.5,
    color: 'rgba(0, 0, 0, 0.5)',
  },
})
