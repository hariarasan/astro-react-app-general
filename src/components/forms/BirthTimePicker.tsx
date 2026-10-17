import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';

interface Props {
  value: Date | null;
  onChange: (time: Date) => void;
  error?: string | null;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function BirthTimePicker({ value, onChange, error }: Props) {
  const [visible, setVisible] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    setVisible(Platform.OS === 'ios');
    if (event.type === 'set' && selected) {
      onChange(selected);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Birth Time (AM / PM)</Text>
      <TouchableOpacity
        style={[styles.field, !!error && styles.fieldError]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}>
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value ? formatTime(value) : 'Select birth time'}
        </Text>
      </TouchableOpacity>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {visible && (
        <DateTimePicker
          value={value ?? new Date(2000, 0, 1, 12, 0)}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
