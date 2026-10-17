import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { BirthTimePicker } from '../components/forms/BirthTimePicker';
import { CitySearchInput } from '../components/forms/CitySearchInput';
import { DateOfBirthPicker } from '../components/forms/DateOfBirthPicker';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { LabeledInput } from '../components/common/LabeledInput';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useBirthData } from '../context/BirthDataContext';
import { colors } from '../theme/colors';
import { radius, spacing, typography } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';
import type { BirthFormValues } from '../types/location';

type Props = NativeStackScreenProps<RootStackParamList, 'BirthDetails'>;

const emptyForm: BirthFormValues = {
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  birthTime: null,
  location: null,
};

export function BirthDetailsScreen({ navigation }: Props) {
  const { status, errorMessage, submit } = useBirthData();

  const [form, setForm] = useState<BirthFormValues>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === 'success') {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  }, [status, navigation]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
    if (!form.birthTime) errors.birthTime = 'Birth time is required.';
    if (!form.location) errors.location = 'Please select a birth location from the list.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    submit(form);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.languageBar}>
        <Text style={styles.languageLabel}>Chart language</Text>
        <LanguageSelector />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ MAGB Vedic Astrology</Text>
        <Text style={styles.headerSubtitle}>Enter birth details to generate your chart</Text>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {status === 'error' && errorMessage && <ErrorBanner message={errorMessage} />}

        <LabeledInput
          label="First Name"
          value={form.firstName}
          onChangeText={text => setForm(prev => ({ ...prev, firstName: text }))}
          error={fieldErrors.firstName}
          placeholder="e.g. Ashok"
        />
        <LabeledInput
          label="Last Name"
          value={form.lastName}
          onChangeText={text => setForm(prev => ({ ...prev, lastName: text }))}
          error={fieldErrors.lastName}
          placeholder="e.g. Kumar"
        />
        <CitySearchInput
          value={form.location}
          onSelect={city => setForm(prev => ({ ...prev, location: city }))}
          error={fieldErrors.location}
        />
        <DateOfBirthPicker
          value={form.dateOfBirth}
          onChange={date => setForm(prev => ({ ...prev, dateOfBirth: date }))}
          error={fieldErrors.dateOfBirth}
        />
        <BirthTimePicker
          value={form.birthTime}
          onChange={time => setForm(prev => ({ ...prev, birthTime: time }))}
          error={fieldErrors.birthTime}
        />


        <PrimaryButton
          label="Generate My Chart"
          onPress={handleSubmit}
          loading={status === 'loading'}
          style={styles.submitButton}
        />
      </ScrollView>

      <LoadingOverlay visible={status === 'loading'} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.cream },
  languageBar: {
    backgroundColor: colors.yellow,
    paddingTop: Platform.OS === 'android' ? spacing.lg : spacing.xl + 20,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  languageLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.redDark,
    marginBottom: spacing.xs,
  },
  header: {
    backgroundColor: colors.red,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    borderBottomWidth: 4,
    borderBottomColor: colors.yellow,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.white,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.yellow,
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
