const fs = require('fs');
const https = require('https');

https.get('https://bankstatementwizard.com/banks', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/"full_name":"(.*?)"/g);
    if (!matches) {
      console.log('No banks found');
      return;
    }

    const newBanks = [];
    matches.forEach(match => {
      const name = match.replace('"full_name":"', '').replace('"', '');
      const keyword = name.toLowerCase();
      newBanks.push([keyword, name]);
    });

    const banksFilePath = 'lib/config/banks.ts';
    let banksContent = fs.readFileSync(banksFilePath, 'utf8');

    let insertedCount = 0;
    let appendedBanksStr = '';

    newBanks.forEach(([keyword, name]) => {
      if (!banksContent.includes(`"${keyword}"`) && !banksContent.includes(`"${name}"`)) {
        appendedBanksStr += `  ["${keyword.replace(/"/g, '\\"')}", "${name.replace(/"/g, '\\"')}"]` + ",\n";
        insertedCount++;
      }
    });

    if (insertedCount > 0) {
      // Find where to insert it before the closing bracket of SUPPORTED_BANKS
      const closingBracketIndex = banksContent.lastIndexOf('];');
      if (closingBracketIndex !== -1) {
        banksContent = 
          banksContent.substring(0, closingBracketIndex) + 
          "  // Added from bankstatementwizard.com\n" + 
          appendedBanksStr + 
          banksContent.substring(closingBracketIndex);
        
        fs.writeFileSync(banksFilePath, banksContent, 'utf8');
        console.log(`Successfully added ${insertedCount} new banks.`);
      } else {
        console.log("Could not find end of SUPPORTED_BANKS array.");
      }
    } else {
      console.log('No new banks to add.');
    }
  });
}).on('error', (e) => {
  console.error(e);
});
