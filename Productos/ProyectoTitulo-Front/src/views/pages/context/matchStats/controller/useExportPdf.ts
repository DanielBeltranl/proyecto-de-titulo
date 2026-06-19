import { useState, useCallback } from 'react';
import { buildMatchStatsPdf } from '../model/pdfBuilder';
import type { MatchStatsData, MatchDetail } from '../model/matchStatsModel';

export const useExportPdf = (data: MatchStatsData | null, detail: MatchDetail | null) => {
  const [exporting, setExporting] = useState(false);

  const exportPdf = useCallback(async () => {
    if (!data || exporting) return;
    setExporting(true);
    try {
      buildMatchStatsPdf(data, detail);
    } finally {
      setExporting(false);
    }
  }, [data, detail, exporting]);

  return { exporting, exportPdf };
};
