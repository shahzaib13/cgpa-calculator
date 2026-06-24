#include <iostream>
#include <iomanip>

void heading();
using namespace std;

int main()
{   
    const int size = 6;
    
    const string subjects[size] = {
        "Software Engineering",
        "Computer Networking",
        "Entrepreneurship",
        "COAL", 
        "Web Technologies",
        "Ideology and Constitution of Pakistan"
    }; 
    const int credit_hours[size] = {3, 3, 3, 3, 3, 2};
    
    float gpa[size];
    int total_credit = 0;
    float total_grade = 0;
    
    heading();
    for (int i = 0; i < size; i++)
    {
        cout << "Enter the GPA of " << subjects[i] << " : ";
        cin >> gpa[i];

        total_credit += credit_hours[i];
        total_grade += (gpa[i] * credit_hours[i]);
    }

    float CGPA = total_grade / total_credit;
    cout << fixed << setprecision(2);
    cout << "Your CGPA is " << CGPA <<  endl;
    
    return 0;
}

void heading(){
    cout << "\t:: 4th Semester CGPA Calculator by Shahzaib Saleem ::\n";
}