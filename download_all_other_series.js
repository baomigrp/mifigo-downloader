/**
 * 02.기타시리즈 폴더아래에 이미지를 다운로드하는 스크립트
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 최상위 기준 폴더 경로
const ROOT_DIR = "D:\\mifigo\\01.파일\\01.사진\\02.기타시리즈";

// 📌 시리즈 코드별 미니피규어 구성 데이터 매핑 (필요에 따라 추가/수정)
const seriesDataMap = {
    "71012": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Stitch", korName: "스티치" },
        { no: 2, engName: "Alien", korName: "에일리언" },
        { no: 3, engName: "Buzz Lightyear", korName: "버즈 라이트이어" },
        { no: 4, engName: "Aladdin", korName: "알라딘" },
        { no: 5, engName: "Genie", korName: "지니" },
        { no: 6, engName: "Maleficent", korName: "말레피센트" },
        { no: 7, engName: "Alice", korName: "앨리스" },
        { no: 8, engName: "Cheshire Cat", korName: "체셔 캣" },
        { no: 9, engName: "Daisy Duck", korName: "데이지 덕" },
        { no: 10, engName: "Donald Duck", korName: "도널드 덕" },
        { no: 11, engName: "Minnie Mouse", korName: "미니 마우스" },
        { no: 12, engName: "Mickey Mouse", korName: "미키 마우스" },
        { no: 13, engName: "Mr. Incredible", korName: "미스터 인크레더블" },
        { no: 14, engName: "Syndrome", korName: "신드롬" },
        { no: 15, engName: "Peter Pan", korName: "피터 팬" },
        { no: 16, engName: "Captain Hook", korName: "후크 선장" },
        { no: 17, engName: "Ursula", korName: "우르술라" },
        { no: 18, engName: "Ariel", korName: "아리엘" },
        { no: 19, engName: "set", korName: "전체 세트" },
        { no: 20, engName: "box", korName: "박스" }
    ],

    "71024": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Vintage Mickey", korName: "빈티지 미키" },
        { no: 2, engName: "Vintage Minnie", korName: "빈티지 미니" },
        { no: 3, engName: "Huey", korName: "휴이" },
        { no: 4, engName: "Dewey", korName: "듀이" },
        { no: 5, engName: "Louie", korName: "루이" },
        { no: 6, engName: "Scrooge McDuck", korName: "스크루지 맥덕" },
        { no: 7, engName: "Chip", korName: "칩" },
        { no: 8, engName: "Dale", korName: "데일" },
        { no: 9, engName: "Elsa", korName: "엘사" },
        { no: 10, engName: "Anna", korName: "안나" },
        { no: 11, engName: "Jafar", korName: "자파" },
        { no: 12, engName: "Jasmine", korName: "자스민" },
        { no: 13, engName: "Hades", korName: "하데스" },
        { no: 14, engName: "Hercules", korName: "헤라클레스" },
        { no: 15, engName: "Sally", korName: "샐리" },
        { no: 16, engName: "Jack Skellington", korName: "잭 스켈링턴" },
        { no: 17, engName: "Edna Mode", korName: "에드나 모드" },
        { no: 18, engName: "Frozone", korName: "프로존" },
        { no: 19, engName: "set", korName: "전체 세트" },
        { no: 20, engName: "box", korName: "박스" }
    ],

    "71038": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Oswald the Lucky Rabbit", korName: "행운의 토끼 오스왈드" },
        { no: 2, engName: "Pinocchio", korName: "피노키오" },
        { no: 3, engName: "Jiminy Cricket", korName: "지미니 크리켓" },
        { no: 4, engName: "Sorcerer's Apprentice Mickey", korName: "마법사의 제자 미키" },
        { no: 5, engName: "Tiana", korName: "티아나" },
        { no: 6, engName: "Dr. Facilier", korName: "닥터 파실리에" },
        { no: 7, engName: "Queen of Hearts", korName: "하트 여왕" },
        { no: 8, engName: "Aurora", korName: "오로라" },
        { no: 9, engName: "Mulan", korName: "뮬란" },
        { no: 10, engName: "Ernesto De La Cruz", korName: "에르네스토 데 라 크루즈" },
        { no: 11, engName: "Miguel Rivera", korName: "미겔 리베라" },
        { no: 12, engName: "Pocahontas", korName: "포카혼타스" },
        { no: 13, engName: "Cruella de Vil", korName: "크루엘라 드 빌" },
        { no: 14, engName: "Robin Hood", korName: "로빈 후드" },
        { no: 15, engName: "Prince John", korName: "존 왕자" },
        { no: 16, engName: "Experiment 626 Stitch", korName: "실험체 626 스티치" },
        { no: 17, engName: "Baymax", korName: "베이맥스" },
        { no: 18, engName: "The Queen", korName: "여왕" },
        { no: 19, engName: "set", korName: "전체 세트" },
        { no: 20, engName: "box", korName: "박스" }
    ],

    "71005": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Homer Simpson", korName: "호머 심슨" },
        { no: 2, engName: "Marge Simpson", korName: "마지 심슨" },
        { no: 3, engName: "Bart Simpson", korName: "바트 심슨" },
        { no: 4, engName: "Lisa Simpson", korName: "리사 심슨" },
        { no: 5, engName: "Maggie Simpson", korName: "매기 심슨" },
        { no: 6, engName: "Grampa Simpson", korName: "그랜파 심슨" },
        { no: 7, engName: "Ned Flanders", korName: "네드 플랜더스" },
        { no: 8, engName: "Ralph Wiggum", korName: "랄프 위검" },
        { no: 9, engName: "Nelson Muntz", korName: "넬슨 먼츠" },
        { no: 10, engName: "Apu Nahasapeemapetilon", korName: "아푸 나하사피마페틸론" },
        { no: 11, engName: "Chief Wiggum", korName: "위검 서장" },
        { no: 12, engName: "Krusty the Clown", korName: "크러스티 더 클라운" },
        { no: 13, engName: "Itchy", korName: "이치" },
        { no: 14, engName: "Scratchy", korName: "스크래치" },
        { no: 15, engName: "Mr. Burns", korName: "번즈 사장" },
        { no: 16, engName: "Milhouse Van Houten", korName: "밀하우스 반 호텐" },
        { no: 17, engName: "set", korName: "전체 세트" },
        { no: 18, engName: "box", korName: "박스" }
    ],

    "71009": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Date Night Homer", korName: "데이트 복장의 호머" },
        { no: 2, engName: "Date Night Marge", korName: "데이트 복장의 마지" },
        { no: 3, engName: "Lisa with Snowball II", korName: "스노우볼 2세와 리사" },
        { no: 4, engName: "Maggie and Santa's Little Helper", korName: "산타의 작은 도우미와 매기" },
        { no: 5, engName: "Bartman", korName: "바트맨" },
        { no: 6, engName: "Fallout Boy Milhouse", korName: "폴아웃 보이 밀하우스" },
        { no: 7, engName: "Comic Book Guy", korName: "코믹 북 가이" },
        { no: 8, engName: "Martin Prince", korName: "마틴 프린스" },
        { no: 9, engName: "Professor Frink", korName: "프링크 교수" },
        { no: 10, engName: "Hans Moleman", korName: "한스 몰맨" },
        { no: 11, engName: "Selma", korName: "셀마" },
        { no: 12, engName: "Patty", korName: "패티" },
        { no: 13, engName: "Groundskeeper Willie", korName: "관리인 윌리" },
        { no: 14, engName: "Edna Krabappel", korName: "에드나 크라바펠" },
        { no: 15, engName: "Waylon Smithers", korName: "웨일런 스미더스" },
        { no: 16, engName: "Dr. Hibbert", korName: "히버트 박사" },
        { no: 17, engName: "set", korName: "전체 세트" },
        { no: 18, engName: "box", korName: "박스" }
    ],

    "71030": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Lola Bunny", korName: "롤라 버니" },
        { no: 2, engName: "Bugs Bunny", korName: "벅스 버니" },
        { no: 3, engName: "Wile E. Coyote", korName: "와일 E. 코요테" },
        { no: 4, engName: "Road Runner", korName: "로드 러너" },
        { no: 5, engName: "Tweety", korName: "트위티" },
        { no: 6, engName: "Sylvester", korName: "실베스터" },
        { no: 7, engName: "Daffy Duck", korName: "대피 덕" },
        { no: 8, engName: "Speedy Gonzales", korName: "스피디 곤잘레스" },
        { no: 9, engName: "Taz the Tasmanian Devil", korName: "태즈메이니아 데빌 태즈" },
        { no: 10, engName: "Marvin the Martian", korName: "화성인 마빈" },
        { no: 11, engName: "Petunia Pig", korName: "페투니아 피그" },
        { no: 12, engName: "Porky Pig", korName: "포키 피그" },
        { no: 13, engName: "set", korName: "전체 세트" },
        { no: 14, engName: "box", korName: "박스" }
    ],

    "71033": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Rowlf", korName: "롤프" },
        { no: 2, engName: "Dr. Bunsen Honeydew", korName: "번슨 허니듀 박사" },
        { no: 3, engName: "Beaker", korName: "비커" },
        { no: 4, engName: "The Great Gonzo", korName: "그레이트 곤조" },
        { no: 5, engName: "Kermit the Frog", korName: "커밋" },
        { no: 6, engName: "Miss Piggy", korName: "미스 피기" },
        { no: 7, engName: "Fozzie Bear", korName: "포지 베어" },
        { no: 8, engName: "Animal", korName: "애니멀" },
        { no: 9, engName: "Waldorf", korName: "월도프" },
        { no: 10, engName: "Statler", korName: "스태틀러" },
        { no: 11, engName: "Swedish Chef", korName: "스웨디시 셰프" },
        { no: 12, engName: "Janice", korName: "재니스" },
        { no: 13, engName: "set", korName: "전체 세트" },
        { no: 14, engName: "box", korName: "박스" }
    ],

    "71053": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Thelonious", korName: "텔로니어스" },
        { no: 2, engName: "Puss in Boots", korName: "장화 신은 고양이" },
        { no: 3, engName: "Gingy", korName: "진저브레드 맨" },
        { no: 4, engName: "Shrek", korName: "슈렉" },
        { no: 5, engName: "Dragon", korName: "드래곤" },
        { no: 6, engName: "Fiona and Donkey", korName: "피오나와 동키" },
        { no: 7, engName: "Merlin", korName: "멀린" },
        { no: 8, engName: "Pinocchio", korName: "피노키오" },
        { no: 9, engName: "Big Bad Wolf", korName: "큰 나쁜 늑대" },
        { no: 10, engName: "Lord Farquaad", korName: "파콰드 경" },
        { no: 11, engName: "Fairy Godmother", korName: "요정 대모" },
        { no: 12, engName: "Prince Charming", korName: "차밍 왕자" },
        { no: 13, engName: "set", korName: "전체 세트" },
        { no: 14, engName: "box", korName: "박스" }
    ],

    "71004": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Calamity Drone", korName: "캘러미티 드론" },
        { no: 2, engName: "President Business", korName: "프레지던트 비즈니스" },
        { no: 3, engName: "Hard Hat Emmet", korName: "안전모 에밋" },
        { no: 4, engName: "Wild West Wyldstyle", korName: "와일드 웨스트 와일드스타일" },
        { no: 5, engName: "Abraham Lincoln", korName: "에이브러햄 링컨" },
        { no: 6, engName: "Mrs. Scratchen-Post", korName: "스크래첸 포스트 부인" },
        { no: 7, engName: "Scribble-Face Bad Cop", korName: "낙서 얼굴 배드 캅" },
        { no: 8, engName: "William Shakespeare", korName: "윌리엄 셰익스피어" },
        { no: 9, engName: "Gail the Construction Worker", korName: "건설 노동자 게일" },
        { no: 10, engName: "Larry the Barista", korName: "바리스타 래리" },
        { no: 11, engName: "Velma Staplebot", korName: "벨마 스테이플봇" },
        { no: 12, engName: "Taco Tuesday Guy", korName: "타코 튜즈데이 가이" },
        { no: 13, engName: "'Where Are My Pants?' Guy", korName: "내 바지는 어디 있지 가이" },
        { no: 14, engName: "Wiley Fusebot", korName: "와일리 퓨즈봇" },
        { no: 15, engName: "Panda Guy", korName: "판다 가이" },
        { no: 16, engName: "Marsha Queen of the Mermaids", korName: "인어 여왕 마샤" },
        { no: 17, engName: "set", korName: "전체 세트" },
        { no: 18, engName: "box", korName: "박스" }
    ],

    "71017": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Lobster-Lovin' Batman", korName: "랍스터를 사랑하는 배트맨" },
        { no: 2, engName: "Glam Metal Batman", korName: "글램 메탈 배트맨" },
        { no: 3, engName: "Fairy Batman", korName: "요정 배트맨" },
        { no: 4, engName: "Clan of the Cave Batman", korName: "원시인 배트맨" },
        { no: 5, engName: "Vacation Batman", korName: "휴가 중인 배트맨" },
        { no: 6, engName: "Barbara Gordon", korName: "바바라 고든" },
        { no: 7, engName: "Commissioner Gordon", korName: "고든 국장" },
        { no: 8, engName: "The Joker - Arkham Asylum", korName: "아캄 수용소 조커" },
        { no: 9, engName: "Dick Grayson", korName: "딕 그레이슨" },
        { no: 10, engName: "Pink Power Batgirl", korName: "핑크 파워 배트걸" },
        { no: 11, engName: "Red Hood", korName: "레드 후드" },
        { no: 12, engName: "The Eraser", korName: "이레이저" },
        { no: 13, engName: "Nurse Harley Quinn", korName: "간호사 할리 퀸" },
        { no: 14, engName: "Orca", korName: "오르카" },
        { no: 15, engName: "Zodiac Master", korName: "조디악 마스터" },
        { no: 16, engName: "Catman", korName: "캣맨" },
        { no: 17, engName: "March Harriet", korName: "마치 해리엇" },
        { no: 18, engName: "The Calculator", korName: "계산기" },
        { no: 19, engName: "King Tut", korName: "투탕카멘" },
        { no: 20, engName: "The Mime", korName: "마임" },
        { no: 21, engName: "set", korName: "전체 세트" },
        { no: 22, engName: "box", korName: "박스" }
    ],

    "71019": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Kai Kendo", korName: "카이 켄도" },
        { no: 2, engName: "Spinjitzu Training Nya", korName: "스핀짓주 수련 중인 니야" },
        { no: 3, engName: "Lloyd", korName: "로이드" },
        { no: 4, engName: "Master Wu", korName: "마스터 우" },
        { no: 5, engName: "Garmadon", korName: "가마돈" },
        { no: 6, engName: "Jay Walker", korName: "제이 워커" },
        { no: 7, engName: "Lloyd Garmadon", korName: "로이드 가마돈" },
        { no: 8, engName: "Cole", korName: "콜" },
        { no: 9, engName: "Misako", korName: "미사코" },
        { no: 10, engName: "Zane", korName: "제인" },
        { no: 11, engName: "Shark Army General #1", korName: "상어 군단 장군 1호" },
        { no: 12, engName: "Shark Army Octopus", korName: "상어 군단 문어" },
        { no: 13, engName: "Shark Army Angler", korName: "상어 군단 아귀" },
        { no: 14, engName: "Shark Army Great White", korName: "상어 군단 백상아리" },
        { no: 15, engName: "Flashback Garmadon", korName: "회상 속 가마돈" },
        { no: 16, engName: "Volcano Garmadon", korName: "화산 가마돈" },
        { no: 17, engName: "Gong & Guitar Rocker", korName: "징과 기타 연주자" },
        { no: 18, engName: "GPL Tech", korName: "GPL 기술자" },
        { no: 19, engName: "Sushi Chef", korName: "스시 요리사" },
        { no: 20, engName: "N-POP Girl", korName: "엔팝 걸" },
        { no: 21, engName: "set", korName: "전체 세트" },
        { no: 22, engName: "box", korName: "박스" }
    ],

    "71020": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Disco Harley Quinn", korName: "디스코 할리 퀸" },
        { no: 2, engName: "Disco Alfred", korName: "디스코 알프레드" },
        { no: 3, engName: "Clock King", korName: "클락 킹" },
        { no: 4, engName: "Hugo Strange", korName: "휴고 스트레인지" },
        { no: 5, engName: "Mermaid Batman", korName: "인어 배트맨" },
        { no: 6, engName: "Swimsuit Batman", korName: "수영복 배트맨" },
        { no: 7, engName: "Vacation Joker", korName: "휴가 중인 조커" },
        { no: 8, engName: "Vacation Robin", korName: "휴가 중인 로빈" },
        { no: 9, engName: "Vacation Batgirl", korName: "휴가 중인 배트걸" },
        { no: 10, engName: "Vacation Alfred", korName: "휴가 중인 알프레드" },
        { no: 11, engName: "Bat-Merch Batgirl", korName: "배트 굿즈 배트걸" },
        { no: 12, engName: "Killer Moth", korName: "킬러 모스" },
        { no: 13, engName: "Wonder Twin Jayna", korName: "원더 트윈 제이나" },
        { no: 14, engName: "Wonder Twin Zan", korName: "원더 트윈 잰" },
        { no: 15, engName: "Apache Chief", korName: "아파치 치프" },
        { no: 16, engName: "Jor-El", korName: "조엘" },
        { no: 17, engName: "General Zod", korName: "조드 장군" },
        { no: 18, engName: "Doctor Phosphorus", korName: "닥터 포스포러스" },
        { no: 19, engName: "Black Canary", korName: "블랙 카나리" },
        { no: 20, engName: "Black Vulcan", korName: "블랙 벌컨" },
        { no: 21, engName: "set", korName: "전체 세트" },
        { no: 22, engName: "box", korName: "박스" }
    ],

    "71023": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Awesome Remix Emmet", korName: "어썸 리믹스 에밋" },
        { no: 2, engName: "Battle-Ready Lucy", korName: "전투 준비 루시" },
        { no: 3, engName: "Apocalypse Benny", korName: "아포칼립스 베니" },
        { no: 4, engName: "Giraffe Guy", korName: "기린 가이" },
        { no: 5, engName: "Crayon Girl", korName: "크레용 걸" },
        { no: 6, engName: "Sherry Scratchen-Post & Scarfield", korName: "셰리 스크래첸 포스트와 스카필드" },
        { no: 7, engName: "Hula Lula", korName: "훌라 룰라" },
        { no: 8, engName: "Watermelon Dude", korName: "수박 가이" },
        { no: 9, engName: "Flashback Lucy", korName: "회상 속 루시" },
        { no: 10, engName: "Swamp Creature", korName: "늪지 괴물" },
        { no: 11, engName: "Candy Rapper", korName: "캔디 래퍼" },
        { no: 12, engName: "Gone Golfin' President Business", korName: "골프 치는 프레지던트 비즈니스" },
        { no: 13, engName: "Apocalypseburg Abe", korName: "아포칼립스버그 에이브" },
        { no: 14, engName: "Vest Friend Rex", korName: "조끼 친구 렉스" },
        { no: 15, engName: "Kitty Pop", korName: "키티 팝" },
        { no: 16, engName: "Dorothy Gale & Toto", korName: "도로시 게일과 토토" },
        { no: 17, engName: "Cowardly Lion", korName: "겁쟁이 사자" },
        { no: 18, engName: "Scarecrow", korName: "허수아비" },
        { no: 19, engName: "Tin Man", korName: "양철 나무꾼" },
        { no: 20, engName: "Unikitty", korName: "유니키티" },
        { no: 21, engName: "set", korName: "전체 세트" },
        { no: 22, engName: "box", korName: "박스" }
    ],

    "71022": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Harry Potter", korName: "해리 포터" },
        { no: 2, engName: "Hermione Granger", korName: "헤르미온느 그레인저" },
        { no: 3, engName: "Ron Weasley", korName: "론 위즐리" },
        { no: 4, engName: "Draco Malfoy", korName: "드레이코 말포이" },
        { no: 5, engName: "Luna Lovegood", korName: "루나 러브굿" },
        { no: 6, engName: "Neville Longbottom", korName: "네빌 롱바텀" },
        { no: 7, engName: "Cho Chang", korName: "초 챙" },
        { no: 8, engName: "Dean Thomas", korName: "딘 토마스" },
        { no: 9, engName: "Lord Voldemort", korName: "볼드모트 경" },
        { no: 10, engName: "Dobby", korName: "도비" },
        { no: 11, engName: "Professor Trelawney", korName: "트릴로니 교수" },
        { no: 12, engName: "Cedric Diggory", korName: "세드릭 디고리" },
        { no: 13, engName: "Professor Flitwick", korName: "플리트윅 교수" },
        { no: 14, engName: "Mad-Eye Moody", korName: "매드아이 무디" },
        { no: 15, engName: "Harry Potter in Pajamas", korName: "잠옷 차림의 해리 포터" },
        { no: 16, engName: "Albus Dumbledore", korName: "알버스 덤블도어" },
        { no: 17, engName: "Newt Scamander", korName: "뉴트 스캐맨더" },
        { no: 18, engName: "Tina Goldstein", korName: "티나 골드스틴" },
        { no: 19, engName: "Jacob Kowalski", korName: "제이콥 코왈스키" },
        { no: 20, engName: "Queenie Goldstein", korName: "퀴니 골드스틴" },
        { no: 21, engName: "Credence Barebone", korName: "크레덴스 베어본" },
        { no: 22, engName: "Percival Graves", korName: "퍼시벌 그레이브스" },
        { no: 23, engName: "set", korName: "전체 세트" },
        { no: 24, engName: "box", korName: "박스" }
    ],

    "71028": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Harry Potter", korName: "해리 포터" },
        { no: 2, engName: "Albus Dumbledore", korName: "알버스 덤블도어" },
        { no: 3, engName: "Hermione Granger", korName: "헤르미온느 그레인저" },
        { no: 4, engName: "Ron Weasley", korName: "론 위즐리" },
        { no: 5, engName: "Luna Lovegood", korName: "루나 러브굿" },
        { no: 6, engName: "Griphook", korName: "그립훅" },
        { no: 7, engName: "Lily Potter", korName: "릴리 포터" },
        { no: 8, engName: "James Potter", korName: "제임스 포터" },
        { no: 9, engName: "Ginny Weasley", korName: "지니 위즐리" },
        { no: 10, engName: "Fred Weasley", korName: "프레드 위즐리" },
        { no: 11, engName: "George Weasley", korName: "조지 위즐리" },
        { no: 12, engName: "Bellatrix Lestrange", korName: "벨라트릭스 레스트랭" },
        { no: 13, engName: "Kingsley Shacklebolt", korName: "킹슬리 샤클볼트" },
        { no: 14, engName: "Moaning Myrtle", korName: "울보 머틀" },
        { no: 15, engName: "Professor Sprout", korName: "스프라우트 교수" },
        { no: 16, engName: "Neville Longbottom", korName: "네빌 롱바텀" },
        { no: 17, engName: "set", korName: "전체 세트" },
        { no: 18, engName: "box", korName: "박스" }
    ],

    "71047": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Dwarf Barbarian", korName: "드워프 바바리안" },
        { no: 2, engName: "Gith Warlock", korName: "기스 워록" },
        { no: 3, engName: "Tiefling Sorcerer", korName: "티플링 소서러" },
        { no: 4, engName: "Dragonborn Paladin", korName: "드래곤본 팔라딘" },
        { no: 5, engName: "Halfling Druid", korName: "하플링 드루이드" },
        { no: 6, engName: "Aarakocra Ranger", korName: "아라코크라 레인저" },
        { no: 7, engName: "Mind Flayer", korName: "마인드 플레이어" },
        { no: 8, engName: "Strahd von Zarovich", korName: "스트라드 폰 자로비치" },
        { no: 9, engName: "Elf Bard", korName: "엘프 바드" },
        { no: 10, engName: "The Lady of Pain", korName: "레이디 오브 페인" },
        { no: 11, engName: "Szass Tam", korName: "사스 탐" },
        { no: 12, engName: "Tasha the Witch Queen", korName: "마녀 여왕 타샤" },
        { no: 13, engName: "set", korName: "전체 세트" },
        { no: 14, engName: "box", korName: "박스" }
    ],

    "71026": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Mister Miracle", korName: "미스터 미라클" },
        { no: 2, engName: "Wonder Woman", korName: "원더우먼" },
        { no: 3, engName: "Aquaman", korName: "아쿠아맨" },
        { no: 4, engName: "Stargirl", korName: "스타걸" },
        { no: 5, engName: "Sinestro", korName: "시네스트로" },
        { no: 6, engName: "Cheetah", korName: "치타" },
        { no: 7, engName: "Superman", korName: "슈퍼맨" },
        { no: 8, engName: "Green Lantern", korName: "그린 랜턴" },
        { no: 9, engName: "Cyborg", korName: "사이보그" },
        { no: 10, engName: "Batman", korName: "배트맨" },
        { no: 11, engName: "Huntress", korName: "헌트리스" },
        { no: 12, engName: "Metamorpho", korName: "메타모포" },
        { no: 13, engName: "Joker", korName: "조커" },
        { no: 14, engName: "Bumblebee", korName: "범블비" },
        { no: 15, engName: "The Flash", korName: "플래시" },
        { no: 16, engName: "Bat-Mite", korName: "배트 마이트" },
        { no: 17, engName: "set", korName: "전체 세트" },
        { no: 18, engName: "box", korName: "박스" }
    ],

    "71031": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "The Scarlet Witch", korName: "스칼렛 위치" },
        { no: 2, engName: "The Vision", korName: "비전" },
        { no: 3, engName: "Monica Rambeau", korName: "모니카 램보" },
        { no: 4, engName: "Winter Soldier", korName: "윈터 솔저" },
        { no: 5, engName: "Captain America", korName: "캡틴 아메리카" },
        { no: 6, engName: "Loki", korName: "로키" },
        { no: 7, engName: "Sylvie", korName: "실비" },
        { no: 8, engName: "Zombie Hunter Spidey", korName: "좀비 헌터 스파이디" },
        { no: 9, engName: "Zombie Captain America", korName: "좀비 캡틴 아메리카" },
        { no: 10, engName: "Captain Carter", korName: "캡틴 카터" },
        { no: 11, engName: "T'Challa Star-Lord", korName: "스타로드 티찰라" },
        { no: 12, engName: "Gamora with Blade of Thanos", korName: "타노스의 검을 든 가모라" },
        { no: 13, engName: "set", korName: "전체 세트" },
        { no: 14, engName: "box", korName: "박스" }
    ],

    "71039": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Agatha Harkness", korName: "아가사 하크니스" },
        { no: 2, engName: "Moon Knight", korName: "문 나이트" },
        { no: 3, engName: "Mr. Knight", korName: "미스터 나이트" },
        { no: 4, engName: "The Werewolf", korName: "웨어울프" },
        { no: 5, engName: "She-Hulk", korName: "쉬헐크" },
        { no: 6, engName: "Hawkeye", korName: "호크아이" },
        { no: 7, engName: "Kate Bishop", korName: "케이트 비숍" },
        { no: 8, engName: "Goliath", korName: "골리앗" },
        { no: 9, engName: "Echo", korName: "에코" },
        { no: 10, engName: "Beast", korName: "비스트" },
        { no: 11, engName: "Storm", korName: "스톰" },
        { no: 12, engName: "Wolverine", korName: "울버린" },
        { no: 13, engName: "set", korName: "전체 세트" },
        { no: 14, engName: "box", korName: "박스" }
    ],

    "71050": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Miles Morales / Spider-Man", korName: "마일스 모랄레스 / 스파이더맨" },
        { no: 2, engName: "Hobie Brown / Spider-Punk", korName: "호비 브라운 / 스파이더 펑크" },
        { no: 3, engName: "Miles G. Morales / Prowler", korName: "마일스 G. 모랄레스 / 프라울러" },
        { no: 4, engName: "Gwen Stacy / Spider-Gwen", korName: "그웬 스테이시 / 스파이더 그웬" },
        { no: 5, engName: "Miguel O'Hara / Spider-Man 2099", korName: "미겔 오하라 / 스파이더맨 2099" },
        { no: 6, engName: "Pavitr Prabhakar / Spider-Man India", korName: "파비트르 프라바카르 / 스파이더맨 인디아" },
        { no: 7, engName: "Petra Parker / Cyborg Spider-Woman", korName: "페트라 파커 / 사이보그 스파이더 우먼" },
        { no: 8, engName: "Charlotte Webber / Sun-Spider", korName: "샬럿 웨버 / 선 스파이더" },
        { no: 9, engName: "Margo Kess / Spider-Byte", korName: "마고 케스 / 스파이더 바이트" },
        { no: 10, engName: "Peter B. Parker / Spider-Man & Mayday Parker", korName: "피터 B. 파커 / 스파이더맨과 메이데이 파커" },
        { no: 11, engName: "Patrick O'Hara / Web-Slinger", korName: "패트릭 오하라 / 웹 슬링어" },
        { no: 12, engName: "Peter Parker / Werewolf Spider-Man", korName: "피터 파커 / 늑대인간 스파이더맨" },
        { no: 13, engName: "set", korName: "전체 세트" },
        { no: 14, engName: "box", korName: "박스" }
    ],

    "8909": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Agile Archer", korName: "민첩한 궁수" },
        { no: 2, engName: "Brawny Boxer", korName: "건장한 복서" },
        { no: 3, engName: "Flexible Gymnast", korName: "유연한 체조 선수" },
        { no: 4, engName: "Horseback Rider", korName: "승마 선수" },
        { no: 5, engName: "Judo Fighter", korName: "유도 선수" },
        { no: 6, engName: "Relay Runner", korName: "계주 선수" },
        { no: 7, engName: "Stealth Swimmer", korName: "잠수 수영 선수" },
        { no: 8, engName: "Tactical Tennis Player", korName: "전략적인 테니스 선수" },
        { no: 9, engName: "Wondrous Weightlifter", korName: "놀라운 역도 선수" },
        { no: 10, engName: "set", korName: "전체 세트" },
        { no: 11, engName: "box", korName: "박스" }
    ],

    "71014": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "Manuel Neuer", korName: "마누엘 노이어" },
        { no: 2, engName: "Shkodran Mustafi", korName: "슈코드란 무스타피" },
        { no: 3, engName: "Mesut Özil", korName: "메수트 외질" },
        { no: 4, engName: "Benedikt Höwedes", korName: "베네딕트 회베데스" },
        { no: 5, engName: "Mats Hummels", korName: "마츠 후멜스" },
        { no: 6, engName: "Sami Khedira", korName: "사미 케디라" },
        { no: 7, engName: "Bastian Schweinsteiger", korName: "바스티안 슈바인슈타이거" },
        { no: 8, engName: "André Schürrle", korName: "안드레 쉬를레" },
        { no: 9, engName: "Thomas Müller", korName: "토마스 뮐러" },
        { no: 10, engName: "Jérôme Boateng", korName: "제롬 보아텡" },
        { no: 11, engName: "Toni Kroos", korName: "토니 크로스" },
        { no: 12, engName: "Mario Götze", korName: "마리오 괴체" },
        { no: 13, engName: "Christoph Kramer", korName: "크리스토프 크라머" },
        { no: 14, engName: "Marco Reus", korName: "마르코 로이스" },
        { no: 15, engName: "Max Kruse", korName: "막스 크루제" },
        { no: 16, engName: "Joachim Löw", korName: "요아힘 뢰프" },
        { no: 17, engName: "set", korName: "전체 세트" },
        { no: 18, engName: "box", korName: "박스" }
    ],

    "71049": [
        { no: "0", engName: "bag", korName: "봉지" },
        { no: 1, engName: "RB20", korName: "레드불 RB20" },
        { no: 2, engName: "Mercedes-AMG", korName: "메르세데스-AMG" },
        { no: 3, engName: "Ferrari", korName: "페라리" },
        { no: 4, engName: "McLaren", korName: "맥라렌" },
        { no: 5, engName: "Aston Martin", korName: "애스턴 마틴" },
        { no: 6, engName: "Alpine", korName: "알핀" },
        { no: 7, engName: "Williams", korName: "윌리엄스" },
        { no: 8, engName: "VCARB", korName: "VCARB" },
        { no: 9, engName: "Sauber", korName: "자우버" },
        { no: 10, engName: "Haas", korName: "하스" },
        { no: 11, engName: "F1 ACADEMY", korName: "F1 아카데미" },
        { no: 12, engName: "F1 Car", korName: "F1 레이스카" },
        { no: 13, engName: "set", korName: "전체 세트" },
        { no: 14, engName: "box", korName: "박스" }
    ]
};

// 이미지 단건 다운로드 함수
async function downloadImage(url, filePath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://rebrickable.com/'
            }
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ 다운로드 실패 (${path.basename(filePath)}):`, error.message);
    }
}

// 파일명으로 사용 불가한 특수문자 안전하게 치환/제거하는 함수
function sanitizeFilename(name) {
    return String(name)
        .replace(/[<>:"/\\|?*]/g, '') // Windows 파일명 금지 문자 제거
        .trim();
}

// 재귀적으로 폴더를 탐색하며 제품 폴더(숫자로 시작하는 폴더)를 찾아 처리하는 함수
async function scanAndProcessFolders(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            // 폴더 이름 앞의 4~5자리 숫자 시리즈 코드 추출 (예: "71012 Disney Series 1" -> "71012")
            const match = entry.name.match(/^(\d{4,5})/);

            if (match) {
                const seriesCode = match[1];
                console.log(`\n📁 발견된 시리즈 폴더: [${seriesCode}] -> ${entry.name}`);

                const minifigures = seriesDataMap[seriesCode];
                if (!minifigures) {
                    console.log(`⚠️ 경고: 'seriesDataMap'에 시리즈 코드 [${seriesCode}]에 대한 미니피규어 데이터가 없습니다. 데이터를 추가해주세요.`);
                    continue;
                }

                // 해당 폴더 내에 이미지 다운로드 시작
                for (const fig of minifigures) {

                    // 📌 파일명에 들어갈 문자열 정제 (물음표나 따옴표 등 제거)
                    const safeEngName = sanitizeFilename(fig.engName);
                    const safeKorName = sanitizeFilename(fig.korName);

                    const filename = `${seriesCode}-${fig.no}_${safeEngName}_${safeKorName}.jpg`;
                    const targetFilePath = path.join(fullPath, filename);

                    // 이미 파일이 존재하면 스킵하려면 아래 주석 해제 가능
                    /* if (fs.existsSync(targetFilePath)) {
                        console.log(`[존재함 스킵] ${filename}`);
                        continue;
                    } */

                    const imageUrl = `https://cdn.rebrickable.com/media/thumbs/sets/${seriesCode}-${fig.no}.jpg/1000x800p.jpg?1`;
                    
                    console.log(`[다운로드 중] ${filename}`);
                    await downloadImage(imageUrl, targetFilePath);

                    // 서버 부하 방지용 0.3초 대기
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                console.log(`✨ [${seriesCode}] 시리즈 다운로드 완료!`);

            } else {
                // 숫자로 시작하지 않는 상위 분류 폴더인 경우 내부로 재귀 진입
                await scanAndProcessFolders(fullPath);
            }
        }
    }
}

// 메인 실행
async function start() {
    console.log(`🚀 '${ROOT_DIR}' 경로 하위 폴더 탐색 및 이미지 다운로드를 시작합니다...\n`);
    await scanAndProcessFolders(ROOT_DIR);
    console.log('\n🎉 모든 작업이 완료되었습니다!');
}

start();