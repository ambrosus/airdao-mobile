import { ConfigPlugin, withMainActivity } from 'expo/config-plugins';

const withSecureFlag: ConfigPlugin = (config) => {
  return withMainActivity(config, async (config) => {
    if (config.modResults.language === 'java') {
      let content = config.modResults.contents;
      content = content.replace(
        'import android.os.Bundle;',
        `import android.os.Bundle;\n
         import android.view.WindowManager;`
      );
      const flagSecureCode = `getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);`;
      if (!content.includes(flagSecureCode)) {
        content = content.replace(
          'super.onCreate(savedInstanceState);',
          `super.onCreate(savedInstanceState);\n
           ${flagSecureCode}`
        );
      }
      config.modResults.contents = content;
    }
    return config;
  });
};

export default withSecureFlag;
