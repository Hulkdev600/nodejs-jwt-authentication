CREATE DEFINER=`junghun`@`localhost` PROCEDURE `authHandler`(
	IN _job varchar(10),
	IN _email varchar(200),
    IN _password varchar(1000),
    IN _name varchar(100)


)
BEGIN

    DECLARE _rCnt int(11) default 0;
    DECLARE _code varchar(10) default '';
    DECLARE _msg varchar(100) default '';
    DECLARE _userPK int(11) default 0;


    if _job ='login' then

		-- 코드 '0' =>  로그인성공 :: 아이디 비밀번호 일치
        -- 코드 '-1' => 로그인실패 :: 아이디 일치, 패스워드 불일치
        -- 코드 '-2' => 로그인실패 :: 아이디 없음

		IF(SELECT 1=1 FROM users WHERE email = _email) then

            SET _code = '0';
            SET _msg = '아이디가 일치합니다';
			SELECT _code code, a.* FROM users a WHERE email = _email;

		ELSE

			SET _code = '-1';
            SET _msg = concat('아이디를 찾을 수 없습니다.');


            SELECT _code code, _msg msg;

		END IF;


	elseif _job ='signup' then

		if(SELECT 1=1 FROM users WHERE email = _email) then

			SET _rCnt = 0;
			SET _code = '-1';
            SET _msg = '이 이메일을 사용할 수 없습니다.';

			SELECT _code code, _msg msg;

		else

			INSERT INTO users(email, password, name) values(_email, _password, _name);

            SET _rCnt = ROW_COUNT();
            SET _userPK = last_insert_id();
            SET _code = '0';
            SET _msg = '등록되었습니다.';

            SELECT _rCnt rCnt, _userPK userPK, _code code, _msg msg;



		end if;




	end if;

END