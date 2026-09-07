using System;

Console.Write("Enter your name: ");
string name = Console.ReadLine() ?? "friend";

Console.Write("Enter your birth year: ");
if (int.TryParse(Console.ReadLine(), out int birthYear))
{
    int age = DateTime.Now.Year - birthYear;
    Console.WriteLine($"Hello, {name}! You are approximately {age} years old.");
}
else
{
    Console.WriteLine("Please enter a valid year.");
}