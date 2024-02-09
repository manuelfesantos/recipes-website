export interface RecipeListResponse {
  count: number;
  from: number;
  hits: RecipeItemWrapper[];
  to: number;
  _links: { next?: Link };
}

export interface RecipeItemWrapper {
  recipe: Recipe | RecipeDetails;
  _links: { self: Link };
}

export interface Link {
  href: string;
  title: string;
}

export interface Recipe {
  calories: number;
  image: string;
  ingredientLines: string[];
  label: string;
  source: string;
  uri: string;
  yield: number;
}

export interface RecipeDetails extends Recipe {
  cautions: string[];
  cuisineType: string[];
  dietLabels: string[];
  digest: Digest[];
  dishType: string[];
  healthLabels: string[];
  images: {
    LARGE?: RecipeImage;
    REGULAR?: RecipeImage;
    SMALL?: RecipeImage;
    THUMBNAIL?: RecipeImage;
  };
  ingredients: Ingredient[];
  mealType: string[];
  shareAs: string;
  totalDaily: DailyValues;
  totalNutrients: DailyValues;
  totalWeight: number;
  url: string;
  [keys: string]: any;
}

export interface Digest {
  daily: number;
  hasRDI: boolean;
  label: string;
  schemaOrgTag: string;
  sub?: Digest[];
  tag: string;
  total: number;
  unit: number;
}

export interface RecipeImage {
  height: number;
  url: string;
  width: number;
}

export interface Ingredient {
  food: string;
  measure: string;
  quantity: number;
  text: string;
  weight: number;
  image: string;
}

export interface DailyValues {
  CA?: DailyValue;
  CHOCDF?: DailyValue;
  CHOCDFnet?: DailyValue;
  CHOLE?: DailyValue;
  ENERC_KCAL?: DailyValue;
  FAMS?: DailyValue;
  FAPU?: DailyValue;
  FASAT?: DailyValue;
  FAT?: DailyValue;
  FATRN?: DailyValue;
  FE?: DailyValue;
  FIBTG?: DailyValue;
  FOLAC?: DailyValue;
  FOLDFE?: DailyValue;
  FOLFD?: DailyValue;
  K?: DailyValue;
  MG?: DailyValue;
  NA?: DailyValue;
  NIA?: DailyValue;
  P?: DailyValue;
  PROCNT?: DailyValue;
  RIBF?: DailyValue;
  SUGAR?: DailyValue;
  THIA?: DailyValue;
  TOCPHA?: DailyValue;
  VITA_RAE?: DailyValue;
  VITB6A?: DailyValue;
  VITB12?: DailyValue;
  VITC?: DailyValue;
  VITD?: DailyValue;
  VITK1?: DailyValue;
  WATER?: DailyValue;
  ZN?: DailyValue;
}

export interface DailyValue {
  label: string;
  quantity: number;
  unit: string;
}
