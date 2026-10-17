import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string | null;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function DateOfBirthPicker({ value, onChange, error }: Props) {
  const [visible, setVisible] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    setVisible(Platform.OS === 'ios');
    if (event.type === 'set' && selected) {
      onChange(selected);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
        style={[styles.field, !!error && styles.fieldError]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}>
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value ? formatDate(value) : 'Select date of birth'}
        </Text>
      </TouchableOpacity>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {visible && (
        <DateTimePicker
          value={value ?? new Date(1990, 0, 1)}
          mode="date"
          // Spinner (scrollable day/month/year wheels) on both platforms -
          // Android's calendar-grid "default" display makes jumping back
          // decades slow (month-by-month navigation), whereas spinning the
          // year wheel directly gets there in a couple of flicks.
          display="spinner"
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
    color: colors.black,
    fontWeight: '600',
  },
  field: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  valueText: {
    fontSize: 16,
    color: colors.black,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.grey,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
