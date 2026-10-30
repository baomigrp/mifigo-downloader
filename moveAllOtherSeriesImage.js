/**
 * 1. 02.기타시리즈 하위 폴더의 모든 이미지를 재귀적으로 탐색하여
 * bag_봉지, set_전체 세트, box_박스 파일만 정확히 제외하고 all-image-upload 폴더로 옮기기
 * 
 * 2. 복사된 이미지도 출력
 */
const fs = require('fs');
const path = require('path');

// 최상위 정규시리즈 폴더 경로 지정
const rootDir = 'D:\\mifigo\\01.파일\\01.사진\\02.기타시리즈';
const uploadDir = path.join(rootDir, 'all-image-upload');

// ⚙️ 출력 모드 설정 (true: 간소화 출력, false: 기존 상세 출력)
const isSimpleMode = true; 

let totalCopiedCount = 0;

// 재귀적으로 폴더를 탐색하며 시리즈 폴더를 찾아 이미지를 복사하는 함수
function scanAndCopy(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'all-image-upload') continue;

            const match = entry.name.match(/^(\d{4,5})/);

            if (match) {
                const files = fs.readdirSync(fullPath);
                const imageFiles = files.filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
                });

                imageFiles.sort((a, b) => a.localeCompare(b, 'ko', { numeric: true }));

                for (const filename of imageFiles) {
                    const nameWithoutExt = path.basename(filename, path.extname(filename)).toLowerCase();
                    
                    // 📌 'bag_봉지', 'set_전체 세트', 'box_박스' 단어가 그대로 포함된 경우만 정확히 제외
                    const isExcluded = 
                        nameWithoutExt.includes('bag_봉지') ||
                        nameWithoutExt.includes('set_전체 세트') ||
                        nameWithoutExt.includes('box_박스');

                    // 제외 조건에 해당하면 복사하지 않고 건너뜀
                    if (isExcluded) {
                        continue;
                    }

                    const srcPath = path.join(fullPath, filename);
                    const destPath = path.join(uploadDir, filename);

                    fs.copyFileSync(srcPath, destPath);
                    totalCopiedCount++;

                    if (isSimpleMode) {
                        console.log(filename);
                    } else {
                        console.log(`   └─ 복사 완료: ${filename}`);
                    }
                }

            } else {
                scanAndCopy(fullPath);
            }
        }
    }
}

function collectAndCopyAllImages() {
    try {
        if (!fs.existsSync(rootDir)) {
            console.error(`❌ 해당 폴더가 존재하지 않습니다: ${rootDir}`);
            return;
        }

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        totalCopiedCount = 0;
        scanAndCopy(rootDir);

        if (!isSimpleMode) {
            console.log('\n' + '='.repeat(50));
            console.log(`✨ 총 ${totalCopiedCount}개의 개별 이미지가 'all-image-upload' 폴더로 모아졌습니다!`);
        } else {
            console.log(`\n완료: 총 ${totalCopiedCount}개 복사됨`);
        }

    } catch (error) {
        console.error('❌ 파일 처리 중 에러 발생:', error.message);
    }
}

collectAndCopyAllImages();