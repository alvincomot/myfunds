<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  use WithoutModelEvents;

  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    $admin = User::create([
      'name' => 'Administrator',
      'email' => 'admin@myfunds.com',
      'password' => bcrypt('admin123'),
      'role' => 'admin',
    ]);

    $user = User::create([
      'name' => 'Regular User',
      'email' => 'user@myfunds.com',
      'password' => bcrypt('user123'),
      'role' => 'user',
    ]);

    $this->seedDefaultCategories($admin);
    $this->seedDefaultCategories($user);
  }

  private function seedDefaultCategories(User $user)
  {
      $defaultCategories = [
          ['name' => 'Gaji', 'type' => 'income'],
          ['name' => 'Bonus', 'type' => 'income'],
          ['name' => 'Hadiah', 'type' => 'income'],
          ['name' => 'Makanan & Minuman', 'type' => 'expense'],
          ['name' => 'Transportasi', 'type' => 'expense'],
          ['name' => 'Tagihan', 'type' => 'expense'],
          ['name' => 'Hiburan', 'type' => 'expense'],
      ];

      foreach ($defaultCategories as $cat) {
          \App\Models\Category::create([
              'user_id' => $user->id,
              'name' => $cat['name'],
              'type' => $cat['type'],
          ]);
      }
  }
}
