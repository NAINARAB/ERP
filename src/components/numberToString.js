const numberToWords = (prop) => {
    const number = Number(prop)
    const singleDigits = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', ' Thousand', ' Lakhs'];

    if (number < 10) {
        return singleDigits[number];
    } else if (number < 20) {
        return teens[number - 10];
    } else if (number < 100) {
        const tenDigit = Math.floor(number / 10);
        const singleDigit = number % 10;
        return tens[tenDigit] + (singleDigit !== 0 ? ' ' + singleDigits[singleDigit] : '');
    } else if (number < 1000) {
        const hundredDigit = Math.floor(number / 100);
        const remainingDigits = number % 100;
        return singleDigits[hundredDigit] + ' Hundred' + (remainingDigits !== 0 ? ' and ' + numberToWords(remainingDigits) : '');
    } else if (number < 100000) {
        const thousandDigit = Math.floor(number / 1000);
        const remainingDigits = number % 1000;
        return numberToWords(thousandDigit) + thousands[1] + (remainingDigits !== 0 ? ', ' + numberToWords(remainingDigits) : '');
    } else if (number < 10000000) {
        const lakhDigit = Math.floor(number / 100000);
        const remainingDigits = number % 100000;
        return numberToWords(lakhDigit) + thousands[2] + (remainingDigits !== 0 ? ', ' + numberToWords(remainingDigits) : '');
    } else {
        return 'Number is too large';
    }
}

export default numberToWords;