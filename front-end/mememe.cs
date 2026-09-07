using System;

Console.WriteLine("Enter text (press Ctrl+Z, then Enter when finished):");
var text = Console.In.ReadToEnd();

var lines = text.Length == 0 ? 0 : text.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None).Length;
var words = text.Split((char[])null, StringSplitOptions.RemoveEmptyEntries).Length;
var characters = text.Length;

Console.WriteLine($"Lines: {lines}");
Console.WriteLine($"Words: {words}");
Console.WriteLine($"Characters: {characters}");
