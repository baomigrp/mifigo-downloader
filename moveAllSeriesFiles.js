
/**
 * 01.정규시리즈 하위 폴더의 모든 이미지를 특정폴더로 옯기기
 */
const fs = require('fs');
const path = require('path');

// 최상위 정규시리즈 폴더 경로 지정
const rootDir = 'D:\\mifigo\\01.파일\\01.사진\\01.정규시리즈';
const uploadDir = path.join(rootDir, 'all-image-upload');

// ⚙️ 출력 모드 설정 (true: 간소화 출력, false: 기존 상세 출력)
const isSimpleMode = true; 

function collectAndCopyAllImages() {
    try {
        if (!fs.existsSync(rootDir)) {
            console.error(`❌ 해당 폴더가 존재하지 않습니다: ${rootDir}`);
            return;
        }

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            if (!isSimpleMode) console.log(`📁 통합 폴더 생성됨: ${uploadDir}`);
        }

        const entries = fs.readdirSync(rootDir, { withFileTypes: true });

        const seriesFolders = entries
            .filter(entry => entry.isDirectory() && entry.name !== 'all-image-upload')
            .map(entry => entry.name)
            .sort((a, b) => a.localeCompare(b, 'ko', { numeric: true }));

        if (!isSimpleMode) {
            console.log(`📁 총 ${seriesFolders.length}개의 시리즈 폴더가 확인되었습니다.\n`);
            console.log('='.repeat(50));
        }

        let totalCopiedCount = 0;

        for (const folderName of seriesFolders) {
            const folderPath = path.join(rootDir, folderName);
            const files = fs.readdirSync(folderPath);

            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
            });

            imageFiles.sort((a, b) => a.localeCompare(b, 'ko', { numeric: true }));

            if (!isSimpleMode) {
                console.log(`\n📂 [${folderName}] 처리 중 (${imageFiles.length}개 이미지)...`);
            }

            for (const filename of imageFiles) {
                const srcPath = path.join(folderPath, filename);
                const destPath = path.join(uploadDir, filename);

                // 실제 복사는 모든 모드에서 정상 수행
                fs.copyFileSync(srcPath, destPath);
                totalCopiedCount++;

                if (isSimpleMode) {
                    // 💡 개선된 부분: 파일명에서 확장자를 빼고, 언더바(_)나 공백 기준으로 쪼개서 '단어 단위'로 정확히 비교
                    const nameWithoutExt = path.basename(filename, path.extname(filename)).toLowerCase();
                    const tokens = nameWithoutExt.split(/[_\s]+/); // 예: ['71018', '0', 'bag', '봉지']
                    
                    const excludeWords = ['bag', 'set', 'box', 'all', 'package'];
                    const isBagOrSet = tokens.some(token => excludeWords.includes(token));

                    if (!isBagOrSet) {
                        console.log(filename);
                    }
                } else {
                    console.log(`   └─ 복사 완료: ${filename}`);
                }
            }
        }

        if (!isSimpleMode) {
            console.log('\n' + '='.repeat(50));
            console.log(`✨ 총 ${totalCopiedCount}개의 이미지가 'all-image-upload' 폴더로 성공적으로 모아졌습니다!`);
        } else {
            console.log(`\n완료: 총 ${totalCopiedCount}개 복사됨`);
        }

    } catch (error) {
        console.error('❌ 파일 처리 중 에러 발생:', error.message);
    }
}

collectAndCopyAllImages();