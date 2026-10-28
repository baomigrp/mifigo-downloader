const fs = require('fs');
const path = require('path');


// 혹은 절대 경로로 지정하고 싶다면:
 const targetDir = 'D:\\mifigo\\01.파일\\01.사진\\01.정규시리즈\\시리즈3';

function getFileNameList() {
    try {
        // 폴더가 존재하는지 확인
        if (!fs.existsSync(targetDir)) {
            console.error(`❌ 해당 폴더가 존재하지 않습니다: ${targetDir}`);
            return;
        }

        // 폴더 안의 모든 파일/폴더 목록 읽기
        const files = fs.readdirSync(targetDir);

        // 이미지 파일(.jpg, .png 등)만 필터링하고 싶을 때 (선택사항)
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
        });

        // 💡 파일명 기준 정렬 (오름차순: a -> z, 가 -> 하, 번호 순)
        imageFiles.sort((a, b) => {
            // localeCompare를 사용하면 한글과 숫자가 섞여있어도 자연스럽게 정렬됩니다.
            return a.localeCompare(b, 'ko', { numeric: true });
        });        

        console.log(`📁 총 ${imageFiles.length}개의 파일이 확인되었습니다.\n`);
        console.log('--- [파일명 리스트] ---');
        
        imageFiles.forEach((filename, index) => {
            console.log(`${index + 1}: ${filename}`);
        });

        // 💡 엑셀 업로드용 JSON이나 텍스트로 바로 쓰고 싶다면 아래처럼 활용 가능
        // fs.writeFileSync('file_list.json', JSON.stringify(imageFiles, null, 2), 'utf-8');

        return imageFiles;

    } catch (error) {
        console.error('❌ 파일 목록을 읽는 중 에러 발생:', error.message);
    }
}

getFileNameList();