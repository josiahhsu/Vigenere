let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function is_valid_key(key)
{
    return key.length > 0 && key.toUpperCase().match("[^A-Z]") == null;
}

function convert_char(char, key, encipher)
{
    let shift = alpha.indexOf(key.toUpperCase());
    if (shift < 0)
        return char;

    shift *= encipher? 1 : -1;
    
    let charPos = (alpha.length+alpha.indexOf(char)+shift) % alpha.length;
    return alpha.charAt(charPos);
}

function vigenere(plaintext, key, encipher)
{
    let result = "";
    let pos = 0;
    for (var i = 0; i < plaintext.length; i++)
    {
        let c = plaintext[i].toUpperCase();
        if(alpha.includes(c)){ //only letters encrypted
			c = convert_char(c, key[pos], encipher);
			pos = ++pos % key.length;
		}
        result += c;
    }
    return result;
}
