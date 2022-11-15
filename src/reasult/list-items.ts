import {
  Forecastlevel,
  Language,
  MarketValueStrategy,
  PeriodType,
} from "./api/types";
import { ListItem } from "./functions";

export const periodTypes: ListItem<PeriodType>[] = [
  { id: PeriodType.CalendarYear, name: "Calendar year" },
  { id: PeriodType.ForecastYear, name: "Forecast year" },
];

export const marketValueStrategies: ListItem<MarketValueStrategy>[] = [
  { id: MarketValueStrategy.Hold, name: "Hold" },
  { id: MarketValueStrategy.Privatization, name: "Privatization" },
  {
    id: MarketValueStrategy.HoldAndPrivatization,
    name: "Hold and Privatization",
  },
];

export const forecastLevels: ListItem<Forecastlevel>[] = [
  { id: Forecastlevel.Cashflow, name: "Cash flow" },
  { id: Forecastlevel.GeneralLedger, name: "General ledger" },
];

export const languages: ListItem<Language>[] = [
  { id: Language.English, name: "English" },
  { id: Language.Netherlands, name: "Netherlands" },
];
