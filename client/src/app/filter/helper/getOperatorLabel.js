import { OPERATORS } from '@/app/filter/constants/constant'; // Operatörleri içe aktar
export const getOperatorLabel = (operator) => {
    // Operatör etiketlerini OPERATORS sabitinden al
    for (const type in OPERATORS) {
        const operatorObj = OPERATORS[type].find(op => op.value === operator);
        if (operatorObj) {
            return operatorObj.label;
        }
    }
    return operator; // Eğer operatör bulunamazsa, orijinal değeri döndür
};