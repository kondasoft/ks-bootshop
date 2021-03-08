/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// Shopify Format Money
// https://gist.github.com/stewartknapman/8d8733ea58d2314c373e94114472d44c
Shopify.formatMoney = function(cents, format) {
    if (typeof cents == 'string') { cents = cents.replace('.',''); }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || this.money_format);
   
    function defaultOption(opt, def) {
        return (typeof opt == 'undefined' ? def : opt);
    }
   
    function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal   = defaultOption(decimal, '.');
    
        if (isNaN(number) || number == null) { return 0; }
    
        number = (number/100.0).toFixed(precision);
    
        var parts   = number.split('.'),
            dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
            cents   = parts[1] ? (decimal + parts[1]) : '';
    
        return dollars + cents;
    }
    
    switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
    case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
    case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
    case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }
    
    return formatString.replace(placeholderRegex, value);
};


// Shopify resize image
// https://gist.github.com/DanWebb/cce6ab34dd521fcac6ba
Shopify.resizeImage = function(src, size) {
    if (!src || !size) {
        return;
    }
    return src
        .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
        .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function(match) {
            return '_'+size+match;
        })
    ;
};