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

function crack_vigenere(input, scale)
{
    // filter out non-alphabetic characters from ciphertext
    input = input.toUpperCase();
    let ciphertext = ""
    for (var i = 0; i < input.length; i++)
    {
        let c = input[i];
        if (alpha.includes(c))
            ciphertext += c;
    }

	let n = 1;
	let init = slice(ciphertext, 1, 0);
	let key = init[0];
	let best = init[1];

	let currentVar = best;
	let max_iter = ciphertext.length * scale;
	while(n < max_iter)
	{
        n++;
		currentVar = 0;

		//finds possible key using caesar slices
		let currentKey = "";
		for(var i = 0; i < n; i++)
        {
			let current = slice(ciphertext, n, i);
			currentKey += current[0];
			currentVar += current[1];
		}
        currentVar /= n;

		//compares to best variance
		if(currentVar < best)
        {
            key = currentKey;
            best = currentVar;
		}
	}

	return key;
}

function frequency(o, e)
{
    return Math.pow(o - e,2);
}

function slice(ciphertext, n, start)
{	
	//each index corresponds to letter in alphabet = 0 = a, 1 = b, etc
	let charfreqs = 
		[0.07984, 0.01511, 0.02504, 0.04260, 0.12452, 0.02262, 0.02013,
		 0.06384, 0.0700, 0.00131, 0.00741, 0.03961, 0.02629, 0.06876,
		 0.07691, 0.01741, 0.00107, 0.05912, 0.06333, 0.09058, 0.02844,
		 0.01056, 0.02304, 0.00159, 0.02028, 0.00057];
	let chars = new Array(26).fill(0);

	//counts letter occurrences in ciphertext
	let count = 0;
    for (var i = start; i < ciphertext.length; i+=n)
    {
        chars[alpha.indexOf(ciphertext[i])]++;
        count++;
	}

	//finds frequencies in ciphertext and establishes baseline
	let best = ['A', 0];
	for(var i = 0; i < 26; i++)
    {
        chars[i] /= count;
        best[1] += frequency(chars[i], charfreqs[i]);
	}	
	
	//finds letter w/ lowest variance from standard frequency
	for(var i = 1; i < 26; i++)
    {
		let current = 0.0;
		for(var j = 0; j < 26; j++)
        {
			current += frequency(chars[(j+i)%26], charfreqs[j]);
		}
		if(current < best[1])
        {
			best[0] = alpha[i];
			best[1] = current;
		}
	}
	return best;
}
