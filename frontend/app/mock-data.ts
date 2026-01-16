import { Employee } from '@/app/types';

export const MOCK_EMPLOYEES: Employee[] = [
    { id: 1, fullName: 'გიორგი ბერიძე', position: 'ადმინისტრატორი', department: 'ოპერაციებისა და კლიენტთა მომსახურების დეპარტამენტი', phone: '555 11 22 33', email: 'giorgi@gym.ge', salary: '1200', status: 'Active', joinDate: '2023-01-15' },
    { id: 2, fullName: 'ანა კალაძე', position: 'მთავარი ბუღალტერი', department: 'ფინანსებისა და ადმინისტრაციის დეპარტამენტი', phone: '599 44 55 66', email: 'ana@gym.ge', salary: '2500', status: 'Active', joinDate: '2022-11-01' },
    { id: 3, fullName: 'ლევან დოლიძე', position: 'მთავარი მწვრთნელი (Head Coach)', department: 'ფიტნეს დეპარტამენტი', phone: '577 88 99 00', email: 'levan@gym.ge', salary: '1800', status: 'OnLeave', joinDate: '2023-03-10' },
    { id: 4, fullName: 'ნინო შენგელია', position: 'ჯგუფური კლასების ინსტრუქტორი', department: 'ფიტნეს დეპარტამენტი', phone: '599 00 11 22', email: 'nino@gym.ge', salary: '1500', status: 'Active', joinDate: '2023-05-20' },
    { id: 5, fullName: 'გიორგი მაისურაძე', position: 'წვრთნელი დონე 2 (სენიორი)', department: 'ფიტნეს დეპარტამენტი', phone: '551 22 33 44', email: 'g_maisuradze@gym.ge', salary: '2000', status: 'Active', joinDate: '2022-08-15' }
];

export const MOCK_CORPORATE_CLIENTS = [
    { id: '1', name: 'საქართველოს ბანკი', identCode: '204378869', discountPercentage: 20, contactPerson: 'ნინო ნინოშვილი', phone: '599 00 00 00', activeEmployees: 1450 },
    { id: '2', name: 'თიბისი ბანკი', identCode: '204395896', discountPercentage: 15, contactPerson: 'გიორგი მაისურაძე', phone: '599 11 11 11', activeEmployees: 1200 },
];
