import React, { useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ConditionBadgeList } from '../components/analysis/ConditionBadgeList';
import { MahapurushaYogaCard } from '../components/analysis/MahapurushaYogaCard';
import { ParivartanaList } from '../components/analysis/ParivartanaList';
import { SeventhLordCard } from '../components/analysis/SeventhLordCard';
import { TrineOccupantsCard } from '../components/analysis/TrineOccupantsCard';
import { ChartLegend } from '../components/charts/ChartLegend';
import { VedicChartGrid } from '../components/charts/VedicChartGrid';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { SectionCard } from '../components/common/SectionCard';
import { CurrentPeriodBanner } from '../components/dasha/CurrentPeriodBanner';
import { MahadashaAccordionItem } from '../components/dasha/MahadashaAccordionItem';
import { useBirthData } from '../context/BirthDataContext';
import { useSectionScroll } from '../context/SectionScrollContext';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/theme';

/**
 * All three report sections (Chart, Chart Analysis, Dasha) on a single
 * scrollable page. Each top-level section View reports its own Y offset
 * to SectionScrollProvider via onLayout, so the hamburger menu
 * (CustomDrawerContent) can scroll straight to it instead of navigating
 * to a separate screen.
 */
export function AllSectionsScreen() {
  const { bundle, displayName, birthRequest } = useBirthData();
  const { scrollViewRef, registerSectionOffset } = useSectionScroll();
  const [showPast, setShowPast] = useState(false);

  const { pastMahadashas, currentAndUpcoming, currentIndex } = useMemo(() => {
    if (!bundle) {
      return { pastMahadashas: [], currentAndUpcoming: [], currentIndex: -1 };
    }
    const list = bundle.dasha.mahadashas;
    let idx = list.findIndex(m => m.is_current);
    if (idx === -1) {
      // Fallback: everything after "today" counts as upcoming.
      const today = new Date();
      idx = list.findIndex(m => new Date(`${m.end_date}T00:00:00`) >= today);
      if (idx === -1) idx = list.length - 1;
    }
    return {
      pastMahadashas: list.slice(0, idx),
      currentAndUpcoming: list.slice(idx),
      currentIndex: idx,
    };
  }, [bundle]);

  if (!bundle) {
    return (
      <View style={styles.empty}>
        <ErrorBanner message="No chart data yet. Please go back and enter birth details." />
      </View>
    );
  }

  const { rasi, navamsa, analysis, mahapurusha, dasha } = bundle;
  const planets = analysis.planets;

  return (
    <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{displayName}</Text>
      {!!birthRequest && (
        <Text style={styles.subheading}>
          {birthRequest.date_of_birth} · {birthRequest.time_of_birth} · {birthRequest.place_name}
        </Text>
      )}

      <View onLayout={(e: LayoutChangeEvent) => registerSectionOffset('charts', e.nativeEvent.layout.y)}>
        <Text style={styles.sectionTitle}>🪐 Chart</Text>

        <SectionCard title="Rasi Chart (D1)" subtitle="Birth chart — whole sign houses" accent>
          <VedicChartGrid chart={rasi} title="RASI" />
          <ChartLegend />
        </SectionCard>

        <SectionCard title="Navamsa Chart (D9)" subtitle="9th divisional chart" accent>
          <VedicChartGrid chart={navamsa} title="NAVAMSA" />
          <ChartLegend />
        </SectionCard>
      </View>

      <View
        onLayout={(e: LayoutChangeEvent) => registerSectionOffset('chartAnalysis', e.nativeEvent.layout.y)}>
        <Text style={styles.sectionTitle}>🔎 Chart Analysis</Text>

        <SectionCard title="Planetary Conditions" subtitle="Vakram · Vilimbu · Atchi · Ucham · Neecham">
          <ConditionBadgeList
            label="Vakram (Retrograde)"
            planets={planets.filter(p => p.vakram_retrograde)}
          />
          <ConditionBadgeList
            label="Vilimbu / Sandhi (Cusp)"
            helperText={`Within ${analysis.sandhi_threshold_degrees}° of a sign border`}
            planets={planets.filter(p => p.vilimbu_sandhi)}
          />
          <ConditionBadgeList
            label="Atchi (Own Sign)"
            planets={planets.filter(p => p.atchi_own_sign)}
          />
          <ConditionBadgeList label="Ucham (Exalted)" planets={planets.filter(p => p.ucham_exalted)} />
          <ConditionBadgeList
            label="Neecham (Debilitated)"
            planets={planets.filter(p => p.neecham_debilitated)}
          />
        </SectionCard>

        <SectionCard title="Parivarthanai" subtitle="Mutual sign exchanges">
          <ParivartanaList yogas={analysis.parivartana_yogas} />
        </SectionCard>

        <SectionCard title="Rahu & Ketu Trines" subtitle="Planets in the 1st, 5th & 9th sign from each node">
          {analysis.rahu_ketu_trines.map(trine => (
            <TrineOccupantsCard key={trine.node} trine={trine} />
          ))}
        </SectionCard>

        <SectionCard title="7th House Lord">
          <SeventhLordCard info={analysis.seventh_lord} />
        </SectionCard>

        <SectionCard
          title="Pancha Mahapurusha Yogas"
          subtitle={
            mahapurusha.has_any_yoga
              ? 'This chart has at least one Mahapurusha Yoga'
              : 'None of the 5 yogas are formed'
          }
          accent={mahapurusha.has_any_yoga}>
          {mahapurusha.candidates.map(candidate => (
            <MahapurushaYogaCard key={candidate.yoga} candidate={candidate} />
          ))}
        </SectionCard>
      </View>

      <View onLayout={(e: LayoutChangeEvent) => registerSectionOffset('dasha', e.nativeEvent.layout.y)}>
        <Text style={styles.sectionTitle}>⏳ Dasha</Text>

        <CurrentPeriodBanner current={dasha.current} />

        <SectionCard
          title="Moon Nakshatra at Birth"
          subtitle={`${dasha.moon.nakshatra} · Pada ${dasha.moon.nakshatra_pada} · Lord: ${dasha.moon.nakshatra_lord}`}>
          <Text style={styles.moonDetail}>
            {dasha.moon.sign} {dasha.moon.degree_in_sign.toFixed(2)}° · {dasha.dasha_system} Dasha
            system
          </Text>
        </SectionCard>

        {pastMahadashas.length > 0 && (
          <TouchableOpacity style={styles.pastToggle} onPress={() => setShowPast(prev => !prev)}>
            <Text style={styles.pastToggleText}>
              {showPast
                ? `▲ Hide ${pastMahadashas.length} past Mahadasha(s)`
                : `▼ View ${pastMahadashas.length} past Mahadasha(s)`}
            </Text>
          </TouchableOpacity>
        )}

        {showPast &&
          pastMahadashas.map((mahadasha, idx) => (
            <MahadashaAccordionItem key={`${mahadasha.lord}-past-${idx}`} mahadasha={mahadasha} />
          ))}

        <Text style={styles.dashaSectionLabel}>Current & Upcoming</Text>
        {currentAndUpcoming.map((mahadasha, idx) => (
          <MahadashaAccordionItem
            key={`${mahadasha.lord}-${currentIndex + idx}`}
            mahadasha={mahadasha}
            initiallyExpanded={mahadasha.is_current}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.cream,
  },
  heading: {
    ...typography.h2,
    marginBottom: 2,
  },
  subheading: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h1,
    fontSize: 22,
    color: colors.redDark,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: colors.yellow,
    paddingBottom: spacing.xs,
  },
  moonDetail: {
    ...typography.body,
  },
  pastToggle: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pastToggleText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.redDark,
  },
  dashaSectionLabel: {
    ...typography.h3,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
});
