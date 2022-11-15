export enum ReferenceEntityType {
  None = 0,
  PropertyType = 10,
  PropertyDetailedType = 20,
  Sector = 30,
  Country = 40,
  EnergyLabel = 50,
  Strategy = 60,
  RentableUnitDetailedType = 70,
  RealPropertyRight = 80,
  Company = 90,
  City = 100,
  Region = 110,
}

export enum EntityStatus {
  Active = 1,
  Inactive = 2,
}

export enum Fields {
  Erv = 1,
  TargetRent = 2,
  RentCap = 3,
  ReviewRent = 4,
  TaxValue = 5,
  RebuildValue = 6,
  Vpv = 7,
  MarketValueNet = 8,
  TurnoverRate = 9,
  Relet = 10,
  RentFreeTerm = 11,
  VacancyTerm = 12,
  PassingRent = 13,
  CashIncentive = 14,
  LandValue = 15,
}

export enum ClusterCharacteristic {
  Sector = 1,
  City = 2,
  Region = 4,
  Country = 8,
}

export enum Language {
  English = 1,
  Netherlands = 2,
}

export enum Forecastlevel {
  Cashflow = 1,
  GeneralLedger = 2,
}

export enum PeriodType {
  CalendarYear = 1,
  ForecastYear = 2,
}

export enum MarketValueStrategy {
  Hold = 1,
  Privatization = 2,
  HoldAndPrivatization = Hold | Privatization,
}
