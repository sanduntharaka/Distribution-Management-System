export const formatNumberPrice = (number) => {
    // Format the number as #,###.##
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

export const formatNumberValue = (number) => {
    // Format the number as #,###.##
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};