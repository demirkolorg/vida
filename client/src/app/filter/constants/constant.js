export const OPERATORS = {
  text: [
    { value: 'contains', label: 'İçerir' },
    { value: 'equals', label: 'Eşittir' },
    { value: 'startsWith', label: 'İle Başlar' },
    { value: 'endsWith', label: 'İle Biter' },
    { value: 'notContains', label: 'İçermez' },
    { value: 'notEquals', label: 'Eşit Değildir' },
    { value: 'isEmpty', label: 'Boş' },
    { value: 'isNotEmpty', label: 'Boş Değil' },
  ],
  number: [
    { value: 'equals', label: 'Eşittir (=)' },
    { value: 'notEquals', label: 'Eşit Değildir (≠)' },
    { value: 'gt', label: 'Büyüktür (>)' },
    { value: 'gte', label: 'Büyük Eşittir (≥)' },
    { value: 'lt', label: 'Küçüktür (<)' },
    { value: 'lte', label: 'Küçük Eşittir (≤)' },
  ],
  date: [
    { value: 'equals', label: 'Eşittir' },
    { value: 'notEquals', label: 'Eşit Değildir' },
    { value: 'after', label: 'Sonra' },
    { value: 'before', label: 'Önce' },
    { value: 'between', label: 'Arasında' }, 
  ],
  select: [
    { value: 'equals', label: 'Eşittir' },
    { value: 'notEquals', label: 'Eşit Değildir' },
    { value: 'isAnyOf', label: 'Herhangi Biri' }, 
    { value: 'isNoneOf', label: 'Hiçbiri Değil' }, 
  ],
  boolean: [{ value: 'equals', label: 'Eşittir' }],
};
