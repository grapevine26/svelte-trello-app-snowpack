const production = process.env.NODE_ENV === 'production'

function babelOptions() {
    return {
        plugins: production
            ? ['transform-remove-console']
            : []
    }
}

module.exports = {
    mount: {
        public: '/',
        src: '/dist/'
    },
    plugins: [
        ['@snowpack/plugin-svelte', {
            preprocess: require('svelte-preprocess')({
                scss: {
                    // 전역에서 사용할 SCSS 파일을 지정합니다.
                    // 단, style 태그에 lang="scss"가 지정되어 있어야 적용됩니다.
                    prependData: '@import "./src/scss/main.scss";',
                },
                // PostCSS는 Autoprefixer를 설치하면 같이 설치됩니다.(9버전)
                // 10버전 이상은 postcss를 별도 설치해야 합니다.(npm i -D postcss)
                // Autoprefixer는 CSS에 자동으로 공급 업체 접두사(Vendor prefix)를 적용합니다.
                postcss: {
                    plugins: [
                        require('autoprefixer')()
                    ]
                },
                babel: babelOptions()
            })
        }],
        ['@snowpack/plugin-babel', {
            transformOptions: babelOptions()
        }],
        '@snowpack/plugin-dotenv',
        '@snowpack/plugin-sass',
        '@snowpack/plugin-optimize'
    ],
    alias: {
        '~': './src'
    }
}