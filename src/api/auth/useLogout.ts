import { removeTokens } from "@/utils/auth";
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        removeTokens();
        navigate('/login');
    };
    return { logout };
};

export default useLogout;