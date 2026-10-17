import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing, typography } from '../../theme/theme';

interface Props {
  visible: boolean;
  message?: string;
}

// The Render free-tier backend spins down when idle, so the first request
// after a period of inactivity can take 30-60 seconds while it wakes up.
// If loading takes longer than this, swap in a friendlier message instead
// of leaving the generic one up for what can feel like a stuck app.
const SLOW_REQUEST_THRESHOLD_MS = 8000;
const SLOW_REQUEST_MESSAGE =
  "Still working… the server may be waking up from sleep. This can take up to a minute on the first request.";

export function LoadingOverlay({ visible, message = 'Calculating your chart…' }: Props) {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowSlowMessage(false);
      return;
    }

    const timer = setTimeout(() => setShowSlowMessage(true), SLOW_REQUEST_THRESHOLD_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  const displayMessage = showSlowMessage ? SLOW_REQUEST_MESSAGE : message;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color={colors.red} />
          <Text style={styles.text}>{displayMessage}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.yellow,
  },
  text: {
    ...typography.body,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
